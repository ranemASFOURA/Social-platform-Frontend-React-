import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchUsersByName } from '../services/searchService';
import UserCard from '../components/UserCard';
import NavigationBar from '../components/Sidebar';
import RightPanel from '../components/RightPanel'
import '../styles/SearchPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const initialName = query.get('name') || '';
  const [searchInput, setSearchInput] = useState(initialName);
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
    async function fetchSearchResults() {
      if (!searchInput.trim()) {
        setResults([]);
        return;
      }

      try {
        const data = await searchUsersByName(searchInput.trim());
        console.log("Users found:", data);
        setResults(data);
      } catch (err) {
        console.error('Search failed:', err);
      }
    }

    if (!loading) fetchSearchResults();
  }, [searchInput, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements.search.value.trim();
    setSearchInput(name);
  };

  if (loading) return null;


     return (
    <div style={{ display: 'flex' }}>
      <NavigationBar />

      <div className="search-content">
        {/* حقل البحث */}
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            defaultValue={searchInput}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        {/* نتائج البحث */}
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

      <RightPanel />
    </div>
  );
}


