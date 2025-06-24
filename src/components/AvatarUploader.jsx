import React from 'react';
import defaultAvatar from '../assets/default-avatar.png';


export default function AvatarUploader({ selectedFile, imageUrl, onFileChange }) {
  return (
    <div className="avatar-wrapper">
      <img
        src={selectedFile ? URL.createObjectURL(selectedFile) : (imageUrl || defaultAvatar)}
        alt="avatar"
        className="avatar"
      />
      <label className="edit-icon">
        ✏️<input type="file" accept="image/*" onChange={onFileChange} hidden />
      </label>
    </div>
  );
}
