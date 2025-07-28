import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '../services/userService';


const UserContext = createContext();


export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false); //no token
      return;
    }

  getCurrentUser()
    .then(data => {
    console.log("Setting currentUser in context:", data);
    setCurrentUser(data);
    setLoading(false);
  })
    .catch(err => {
      console.error(" Failed to fetch current user:", err);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setLoading(false);
    });
}, []);


  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading  }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
