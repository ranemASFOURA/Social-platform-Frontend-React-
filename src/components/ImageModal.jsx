import React from 'react';
import '../styles/ImageModal.css';
import { convertToCDN } from '../utils/convertToCDN';

export default function ImageModal({ imageUrl, caption, onClose }) {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={e => e.stopPropagation()}>
        <img src={convertToCDN(imageUrl)} alt={caption} className="image-modal-img" />
        {caption && <p className="image-modal-caption">{caption}</p>}
      </div>
    </div>
  );
}
