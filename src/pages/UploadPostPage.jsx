import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useCurrentUser } from '../contexts/UserContext';
import PrimaryButton from '../components/PrimaryButton';

export default function UploadPostPage() {
  const { currentUser: user } = useCurrentUser();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      const res = await fetch(`http://localhost:8084/api/images/generate-upload-url?filename=${selectedFile.name}`);
      const { uploadUrl, fileUrl } = await res.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': selectedFile.type },
        body: selectedFile
      });

      const postRes = await fetch('http://localhost:8084/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          caption,
          imageUrl: fileUrl
        })
      });

      if (postRes.ok) {
        alert("Image uploaded successfully!");
        navigate(`/profile/${user.id}`, { state: { reloadPosts: true } });
      } else {
        alert("Failed to upload post.");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="upload-container">
        <h2 className="upload-title">Upload a New Post</h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="upload-input"
        />

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="upload-caption"
        />

        <PrimaryButton onClick={handleUpload} text="Post" />
      </div>
    </div>
  );
}
