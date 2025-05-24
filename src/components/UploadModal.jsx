import React, { useState } from 'react';
import '../styles/UploadModal.css';

export default function UploadModal({ onClose }) {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

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
      alert("Post uploaded!");
      onClose();
    } else {
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
