// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import TimelinePage from './pages/TimelinePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './pages/SignupPage';
import EditProfilePage from './pages/EditProfilePage';
//import UploadPostPage from './pages/UploadPostPage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage'; 
import { UserProvider } from './contexts/UserContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

console.log("REACT_APP_API_URL used is:", process.env.REACT_APP_API_URL);

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </Router>
    </UserProvider>
    
  );
}


export default App;
