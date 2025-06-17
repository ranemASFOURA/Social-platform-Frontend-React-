import React, { useState } from 'react';
import '../styles/UploadModal.css';
import { useCurrentUser } from '../contexts/UserContext';
import { uploadImageToMinIO, createPost } from '../services/postService';

export default function UploadModal({ onClose }) {
  const { currentUser: user } = useCurrentUser();
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      const fileUrl = await uploadImageToMinIO(selectedFile);

      await createPost({
        userId: user.id,
        caption,
        imageUrl: fileUrl,
      });

      alert("Post uploaded!");
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Create New Post</h3>
        <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
        {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="preview" className="preview-img" />}
        <textarea placeholder="Add a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleUpload}>Share</button>
        </div>
      </div>
    </div>
  );
}
