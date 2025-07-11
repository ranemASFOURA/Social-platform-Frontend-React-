import React from 'react';
import '../styles/ImageModal.css';
import { loadImageFromGateway } from '../utils/imageLoader';

export default function ImageModal({ imageUrl, caption, onClose }) {
  const finalUrl = loadImageFromGateway(imageUrl);

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={finalUrl} alt={caption} className="image-modal-img" />
        {caption && <p className="image-modal-caption">{caption}</p>}
      </div>
    </div>
  );
}
