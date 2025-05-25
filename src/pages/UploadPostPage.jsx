import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { getPostsByUser } from '../services/postService';


export default function UploadPostPage() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    // Presigned URL
    const res = await fetch(`http://localhost:8084/api/images/generate-upload-url?filename=${selectedFile.name}`);
    const { uploadUrl, fileUrl } = await res.json();

    // MinIO
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
      alert("image uploaded sucessfully");
      navigate('/profile', { state: { reloadPosts: true } });

    } else {
      alert("failed upload");
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="upload-container">
        <h2>Upload a New Post</h2>
        <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <button onClick={handleUpload}>Post</button>
      </div>
    </div>
  );
}
