import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavigationBar.css';
import UploadModal from './UploadModal';
import { useCurrentUser } from '../contexts/UserContext';

export default function NavigationBar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useCurrentUser();


  return (
    <div className="navbar">
      <h2 className="logo" onClick={() => navigate('/timeline')}>My social app</h2>
      
      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigate(`/search?name=${e.target.value}`);
        }}
      />
      <div className="nav-icons">
        <button onClick={() => navigate('/timeline')} className="icon-btn">🔙</button>
        <button className="icon-btn add-post-btn" onClick={() => setShowModal(true)}>＋</button>

        <button
  onClick={() => {
    const currentPath = window.location.pathname;
    const profilePath = `/profile/${currentUser.id}`;
    if (currentPath !== profilePath) {
      navigate(profilePath);
    }
  }}
  className="icon-btn"
>
  👤
</button>

      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
