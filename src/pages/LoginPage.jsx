import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useCurrentUser } from '../contexts/UserContext';
import { login } from '../services/authService';
import { getCurrentUser } from '../services/userService';

export default function LoginPage() {
  const { setCurrentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  try {
  
    const data = await login(form.email, form.password);
    localStorage.setItem('token', data.token);
    const user = await getCurrentUser();
    setCurrentUser(user);
    navigate('/timeline');

  } catch (err) {
    setError(err.message || "Login failed");
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <InputField name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <InputField name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
    </div>
  );
}
