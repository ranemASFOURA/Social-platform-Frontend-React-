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
    try {
      let finalImageUrl = user.imageUrl;

      if (selectedFile) {
        finalImageUrl = await uploadImageToMinIO(selectedFile);
      }

      const updated = await updateUser(user.id, {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        imageUrl: finalImageUrl
      });

      localStorage.setItem('currentUser', JSON.stringify(updated));
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <div className="avatar-section">
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : (user.imageUrl || defaultAvatar)}
            alt="avatar"
            className="edit-avatar"
          />

          <label className="edit-icon">
            ✏️<input type="file" accept="image/*" onChange={handleFileChange} hidden />
          </label>
        </div>
        <form className="edit-form" onSubmit={handleSave}>
          <input name="firstname" value={user.firstname || ''} onChange={handleChange} placeholder="First Name" />
          <input name="lastname" value={user.lastname || ''} onChange={handleChange} placeholder="Last Name" />
          <input name="email" value={user.email || ''} onChange={handleChange} placeholder="Email" />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
