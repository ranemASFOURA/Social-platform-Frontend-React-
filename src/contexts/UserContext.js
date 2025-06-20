import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '../services/userService';


const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  getCurrentUser()
    .then(data => setCurrentUser(data))
    .catch(err => {
      console.error(" Failed to fetch current user:", err);
      localStorage.removeItem('token');
      setCurrentUser(null);
    });
}, []);


  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
