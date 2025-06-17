import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchUsersByName } from '../services/searchService';
import UserCard from '../components/UserCard';
import NavigationBar from '../components/NavigationBar';
import { useCurrentUser } from '../contexts/UserContext';
import '../styles/SearchPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const name = query.get('name');
  const [results, setResults] = useState([]);
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (name) {
        try {
          const data = await searchUsersByName(name);
          setResults(data);
        } catch (err) {
          console.error('Search failed:', err);
        }
      }
    }
    fetchData();
  }, [name]);

  return (
    <div className="search-wrapper">
      <NavigationBar />
      <div className="search-page">
        <div className="search-results">
          {results.length > 0 ? (
            results.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="no-results">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
