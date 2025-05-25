import React, { useState } from 'react';
import { updateUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfilePage.css';
import defaultAvatar from '../assets/default-avatar.png';
import NavigationBar from '../components/NavigationBar';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  const [user, setUser] = useState(storedUser || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!user.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!user.lastname.trim()) newErrors.lastname = 'Last name is required';

    if (!user.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (password.trim() && password.length < 6) {
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let finalImageUrl = user.imageUrl;

      if (selectedFile) {
        finalImageUrl = await uploadImageToMinIO(selectedFile);
      }

      const updatedUserData = {
  firstname: user.firstname,
  lastname: user.lastname,
  email: user.email,
  imageUrl: finalImageUrl,
};

if (password.trim() !== '') {
  updatedUserData.password = password;
}

const updated = await updateUser(user.id, updatedUserData);


      localStorage.setItem('currentUser', JSON.stringify(updated));
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Update failed:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img
              src={selectedFile ? URL.createObjectURL(selectedFile) : (user.imageUrl || defaultAvatar)}
              alt="avatar"
              className="edit-avatar"
            />
            <label className="edit-icon-bottom">
              ✏️<input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
          </div>
        </div>

        <form className="edit-form" onSubmit={handleSave}>
          <div className="form-group">
            <input name="firstname" value={user.firstname || ''} onChange={handleChange} placeholder="First Name" />
            {errors.firstname && <span className="error-msg">{errors.firstname}</span>}
          </div>

          <div className="form-group">
            <input name="lastname" value={user.lastname || ''} onChange={handleChange} placeholder="Last Name" />
            {errors.lastname && <span className="error-msg">{errors.lastname}</span>}
          </div>

          <div className="form-group">
            <input name="email" value={user.email || ''} onChange={handleChange} placeholder="Email" />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (optional)"
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
