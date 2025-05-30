import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupForm.css';
import defaultAvatar from '../assets/default-avatar.png';
import { createUser } from '../services/userService';
import { useCurrentUser } from '../contexts/UserContext';


export default function SignupForm() {
  const navigate = useNavigate();
  const { setCurrentUser } = useCurrentUser();


  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImageToMinIO = async (file) => {
    const response = await fetch(`http://localhost:8080/api/images/generate-upload-url?filename=${file.name}`);
    const data = await response.json();
    const { uploadUrl, fileUrl } = data;

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

    return fileUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let finalImageUrl = formData.imageUrl;
      if (selectedFile) {
        finalImageUrl = await uploadImageToMinIO(selectedFile);
      } else {
        finalImageUrl = defaultAvatar;
      }

      const user = await createUser({ ...formData, imageUrl: finalImageUrl });

      if (user.id) {
        alert("User created successfully!");
        setCurrentUser(user);
        navigate('/timeline');
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="avatar-wrapper">
        <img
          src={selectedFile ? URL.createObjectURL(selectedFile) : (formData.imageUrl || defaultAvatar)}
          alt="avatar"
          className="avatar"
        />
        <label className="edit-icon">
          ✏️<input type="file" accept="image/*" onChange={handleFileChange} hidden />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
          {errors.firstname && <span className="error-msg">{errors.firstname}</span>}
        </div>

        <div className="form-group">
          <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} />
          {errors.lastname && <span className="error-msg">{errors.lastname}</span>}
        </div>

        <div className="form-group">
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          {errors.password && <span className="error-msg">{errors.password}</span>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
