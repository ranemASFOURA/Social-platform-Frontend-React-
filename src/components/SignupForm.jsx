import React, { useState } from 'react';
import '../styles/SignupForm.css';
import { createUser } from '../services/userService';
import defaultAvatar from '../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../contexts/UserContext';

import AvatarUploader from './AvatarUploader';
import PrimaryButton from './PrimaryButton';
import InputField from './InputField';

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

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      <AvatarUploader
        selectedFile={selectedFile}
        imageUrl={formData.imageUrl}
        onFileChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <form onSubmit={handleSubmit} className="signup-form">
        <InputField name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" error={errors.firstname} />
        <InputField name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" error={errors.lastname} />
        <InputField name="email" value={formData.email} onChange={handleChange} placeholder="Email" error={errors.email} />
        <InputField name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" error={errors.password} />
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
      </form>
    </div>
  );
}
