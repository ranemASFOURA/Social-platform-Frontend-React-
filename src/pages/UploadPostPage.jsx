import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useCurrentUser } from '../contexts/UserContext';
import PrimaryButton from '../components/PrimaryButton';
import { uploadImageToMinIO, createPost } from '../services/postService';

export default function UploadPostPage() {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;

    try {
      const fileUrl = await uploadImageToMinIO(selectedFile);

      await createPost({
        userId: currentUser.id,
        caption,
        imageUrl: fileUrl
      });

      alert("Post uploaded!");
      navigate(`/profile/${currentUser.id}`, { state: { reloadPosts: true } });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
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
