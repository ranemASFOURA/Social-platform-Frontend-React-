import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import PrimaryButton from '../components/PrimaryButton';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1 className="logo-text">Raselle</h1>
        <p className="tagline">Share moments. Connect lives.</p>

        <div className="welcome-buttons">
          <PrimaryButton onClick={() => navigate('/signup')}>Sign Up</PrimaryButton>
          <PrimaryButton onClick={() => navigate('/login')} style={{ backgroundColor: "#fff", color: "#0095f6", border: "1px solid #0095f6" }}>
            Login
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
