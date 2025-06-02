// components/PrimaryButton.jsx
import React from 'react';

export default function PrimaryButton({ children, onClick, type = 'button', style = {} }) {
  return (
    <button className="primary-btn" onClick={onClick} type={type} style={style}>
      {children}
    </button>
  );
}
