// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TimelinePage from './pages/TimelinePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import EditProfilePage from './pages/EditProfilePage';
import UploadPostPage from './pages/UploadPostPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/upload" element={<UploadPostPage />} />
      </Routes>
    </Router>
  );
}


export default App;
