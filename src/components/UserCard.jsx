import React from 'react';
import '../styles/UserCard.css';
import defaultAvatar from '../assets/default-avatar.png';

export default function UserCard({ user }) {
  return (
    <div className="user-card">
      <div className="user-card-left">
        <img
  src={user.imageUrl || defaultAvatar}
  alt="User avatar"
  className="user-card-avatar"
/>

        <div className="user-card-info">
          <h4>{user.firstname} {user.lastname}</h4>
          <p>{user.email}</p>
        </div>
      </div>
      <button className="follow-btn">Follow</button>
    </div>
  );
}
