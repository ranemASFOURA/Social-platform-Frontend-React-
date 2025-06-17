import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useCurrentUser } from '../contexts/UserContext';
import { login } from '../services/authService';

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

      const payload = JSON.parse(atob(data.token.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
        type: payload.type
      };

      setCurrentUser(user);
      navigate('/timeline');
    } catch (err) {
      setError(err.message);
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
