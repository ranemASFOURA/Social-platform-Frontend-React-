import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useCurrentUser } from '../contexts/UserContext';
import PrimaryButton from '../components/PrimaryButton';
import { uploadImageToMinIO, createPost } from '../services/postService';
import { compressImage } from '../services/imageCompressor';


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
  if (!selectedFile) return;

  try {
    const compressed = await compressImage(selectedFile);
    const fileUrl = await uploadImageToMinIO(compressed);


    await createPost({
      caption,
      imageUrl: fileUrl
    });

    alert("Post uploaded!");
    navigate('/profile', { state: { reloadPosts: true } });
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
