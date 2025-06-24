import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  PlusSquare,
  User,
  MessageCircle,
  Search,
  Heart,
  Video
} from 'lucide-react';
import '../styles/Sidebar.css';
import UploadModal from './UploadModal';
import { useCurrentUser } from '../contexts/UserContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useCurrentUser();

  return (
    <div className="sidebar">
      <div className="logo-section" onClick={() => navigate('/timeline')}>
        <img src={require('../assets/raselleLogo.png')} alt="Raselle Logo" className="sidebar-logo" />
        <span className="sidebar-title">Raselle</span>
      </div>

      <div className="nav-links">
        <button onClick={() => navigate('/timeline')} className="nav-link">
          <Home size={20} /> <span>Home</span>
        </button>

        <button className="nav-link" onClick={() => setShowModal(true)}>
          <PlusSquare size={20} /> <span>New Post</span>
        </button>

        <button onClick={() => navigate('/messages')} className="nav-link">
          <MessageCircle size={20} /> <span>Messages</span>
        </button>

        <button onClick={() => navigate('/search')} className="nav-link">
          <Search size={20} /> <span>Search</span>
        </button>

        <button onClick={() => navigate('/activity')} className="nav-link">
          <Heart size={20} /> <span>Activity</span>
        </button>

        <button onClick={() => navigate('/reels')} className="nav-link">
          <Video size={20} /> <span>Reels</span>
        </button>

        <button onClick={() => navigate('/profile')} className="nav-link">
          <User size={20} /> <span>Profile</span>
        </button>
      </div>

      <hr className="divider" />

      <div className="user-info">
        <img
          src={currentUser?.imageUrl || '/default-avatar.png'}
          alt="avatar"
          className="user-avatar"
        />
        <div className="user-name">{currentUser?.firstname} {currentUser?.lastname}</div>
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
