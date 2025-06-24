import React from 'react';
import SignupForm from '../components/SignupForm';
import '../styles/SignupPage.css'; 
import Raselle from '../assets/Raselle.png'; 

export default function SignupPage() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="left-section">
  <h2 className="form-title">Create Account</h2>
  <img src={Raselle} alt="Raselle" className="raselle-big" />
</div>

        <div className="right-section">
          <SignupForm />
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
