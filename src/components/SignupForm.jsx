import React, { useState } from 'react';
import '../styles/SignupForm.css';
import defaultAvatar from '../assets/default-avatar.png';
import { createUser } from '../services/userService';

export default function SignupForm({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    imageUrl: '' // سيملأ لاحقًا فقط إذا تم اختيار صورة
  });

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

  try {
    let finalImageUrl = formData.imageUrl;

    if (selectedFile) {
      finalImageUrl = await uploadImageToMinIO(selectedFile); // استخدم الرابط الجديد مباشرة
    } else {
      finalImageUrl = defaultAvatar; // إذا لم يتم رفع صورة، استخدم صورة default
    }

    const user = await createUser({ ...formData, imageUrl: finalImageUrl });

    if (user.id) {
      alert("User created successfully!");
      onSignupSuccess(user);
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

      <form onSubmit={handleSubmit}>
        <input name="firstname" placeholder="First Name" value={formData.firstname} onChange={handleChange} />
        <input name="lastname" placeholder="Last Name" value={formData.lastname} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
