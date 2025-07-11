import React, { useEffect, useState } from 'react';
import { updateUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import { useCurrentUser } from '../contexts/UserContext';
import AvatarUploader from '../components/AvatarUploader';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import defaultAvatar from '../assets/default-avatar.png';
import { uploadImageToMinIO } from '../services/imageService';
import { compressImage } from '../services/imageCompressor'; 


export default function EditProfilePage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUser();

  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!currentUser) navigate('/login');
    else setUser(currentUser);
  }, [currentUser, navigate]);

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let finalImageUrl = user.imageUrl;
      if (selectedFile) {
        console.log("Original image size:", (selectedFile.size / 1024).toFixed(2), "KB");
        const compressed = await compressImage(selectedFile);
        console.log("Compressed image size:", (compressed.size / 1024).toFixed(2), "KB");
        finalImageUrl = await uploadImageToMinIO(compressed);

      }

      const updatedUserData = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        imageUrl: finalImageUrl,
        bio: user.bio || '',
        ...(password.trim() && { password })
      };

      const updated = await updateUser(updatedUserData);
      setCurrentUser(updated);
      alert('Profile updated successfully!');
      navigate(`/profile/${updated.id}`);
    } catch (error) {
      console.error('Update failed:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
  <div style={{ display: 'flex' }}>
    <Sidebar />

    <div className="edit-profile-wrapper">
      <div className="edit-profile-card-wrapper">
  <div className="edit-profile-card">
    <h2>Edit Profile</h2>
    <div className="avatar-center">
      <AvatarUploader
        selectedFile={selectedFile}
        imageUrl={user.imageUrl || defaultAvatar}
        onFileChange={(e) => setSelectedFile(e.target.files[0])}
      />
    </div>

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
      <InputField
        name="bio"
        value={user.bio || ''}
        onChange={handleChange}
        placeholder="Bio"
      />
      <PrimaryButton type="submit">Save Changes</PrimaryButton>
    </form>
  </div> {}
</div> {}

    </div>

    <RightPanel />
  </div>
);
}