import React, { useEffect, useState } from 'react';
import { updateUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useCurrentUser } from '../contexts/UserContext';
import AvatarUploader from '../components/AvatarUploader';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import defaultAvatar from '../assets/default-avatar.png';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();

  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (currentUser) {
    setUser(currentUser);
  }
}, [currentUser]);
if (!user) return <div>Loading...</div>;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
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

      console.log("Sending update request for ID:", user.id);
console.log("Payload:", updatedUserData);
      const updated = await updateUser(user.id, updatedUserData);
      setCurrentUser(updated);
      alert('Profile updated successfully!');
      navigate(`/profile/${updated.id}`);
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
        <AvatarUploader
          selectedFile={selectedFile}
          imageUrl={user.imageUrl || defaultAvatar}
          onFileChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <form className="edit-form" onSubmit={handleSave}>
          <InputField
            name="firstname"
            value={user.firstname || ''}
            onChange={handleChange}
            placeholder="First Name"
            error={errors.firstname}
          />

          <InputField
            name="lastname"
            value={user.lastname || ''}
            onChange={handleChange}
            placeholder="Last Name"
            error={errors.lastname}
          />

          <InputField
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            placeholder="Email"
            error={errors.email}
          />

          <InputField
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (optional)"
            error={errors.password}
          />

          <PrimaryButton type="submit">Save Changes</PrimaryButton>
        </form>
      </div>
    </div>
  );
} 
