import React from 'react';
import '../styles/RightPanel.css';

export default function RightPanel() {
  const suggestions = [
    { name: 'Bynn', followers: '99k', posts: '942' },
    { name: '9to5mac.com', followers: '106k', posts: '177' },
    { name: 'Taylor Nation', followers: '1.2M', posts: '243' },
    { name: 'Hannah J.', followers: '323', posts: '413' },
  ];

  return (
    <div className="right-panel">
  <h3 className="suggestions-title">For You to Follow</h3>

  {suggestions.map(user => (
    <div className="suggestion-card" key={user.id}>
      <img src={user.avatarUrl} alt={user.name} className="suggestion-avatar" />
      <div className="suggestion-info">
        <p className="suggestion-name">{user.name}</p>
        <p className="suggestion-meta">{user.followers} followers · {user.posts} posts</p>
        <div className="suggestion-buttons">
          <button className="follow-btn">Follow</button>
          <button className="about-btn">About</button>
        </div>
      </div>
    </div>
  ))}
</div>

  );
}
