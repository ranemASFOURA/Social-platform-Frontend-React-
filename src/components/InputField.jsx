// components/InputField.jsx
import React from 'react';

export default function InputField({ name, value, onChange, placeholder, type = "text", error }) {
  return (
    <div className="form-group">
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
