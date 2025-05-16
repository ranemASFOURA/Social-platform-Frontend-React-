import React from 'react';
import NavigationBar from '../components/NavigationBar';
import defaultAvatar from '../assets/default-avatar.png';
import '../styles/ProfilePage.css';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();

  if (!user) return <div>Please sign in first.</div>;

  return (
    <div>
      <NavigationBar />
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={user.imageUrl || defaultAvatar}
            alt="avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>{user.firstname} {user.lastname}</h2>
            <p>{user.email}</p>
            <button className="edit-button" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
