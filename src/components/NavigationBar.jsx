import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, PlusSquare, User } from 'lucide-react';
import '../styles/NavigationBar.css';
import UploadModal from './UploadModal';
import { useCurrentUser } from '../contexts/UserContext';

export default function NavigationBar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useCurrentUser();


  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate('/timeline')}>
  <img src={require('../assets/Raselle.png')} alt="Raselle Logo" className="logo-icon" />
  <span className="logo-text">Raselle</span>
</div>

      
      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigate(`/search?name=${e.target.value}`);
        }}
      />
      <div className="nav-icons">
        <button onClick={() => navigate('/timeline')} className="icon-btn"title="Home">
          <Home size={24} />
  </button>
        <button className="icon-btn" onClick={() => setShowModal(true)} title="Add Post">
    <PlusSquare size={24} />
  </button>

        <button
  onClick={() => {
    navigate('/profile');
  }}
  className="icon-btn"
  title="Profile"
>
  <User size={24} />
</button>

</div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
