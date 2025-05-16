import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

  useEffect(() => {
    async function fetchData() {
      if (name) {
        const data = await searchUsersByName(name);
        setResults(data);
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
