import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchUsersByName } from '../services/searchService';
import UserCard from '../components/UserCard';
import NavigationBar from '../components/NavigationBar';
import '../styles/SearchPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const name = query.get('name');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!name) return;
      try {
        const data = await searchUsersByName(name);
        console.log("Users found:", data);
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }
    if (!loading) fetchData();
  }, [name, loading]);

  if (loading) return null;

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
