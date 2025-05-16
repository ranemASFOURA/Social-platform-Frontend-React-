import React from 'react';
import SignupForm from '../components/SignupForm';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSignupSuccess = (user) => {
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/timeline');
  };

  return (
    <div>
      <SignupForm onSignupSuccess={handleSignupSuccess} />
    </div>
  );
}
