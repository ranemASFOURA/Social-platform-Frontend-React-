// components/FollowPopup.jsx
import React from 'react';
import defaultAvatar from '../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';

export default function FollowPopup({ title, users, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="follow-popup-container" onClick={onClose}>
      <div className="follow-popup-box" onClick={e => e.stopPropagation()}>
        <h4>{title}</h4>
        <ul>
          {users.map(u => (
            <li key={u.id} className="popup-user-item" onClick={() => navigate(`/profile/${u.id}`)}>
              <img src={u.imageUrl || defaultAvatar} alt="avatar" />
              <div>
                <strong>{u.firstname} {u.lastname}</strong>
                <p>{u.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
