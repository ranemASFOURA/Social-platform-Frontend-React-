import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import FeedPostCard from '../components/FeedPostCard';
import { getUserFeed } from '../services/feedService';
import '../styles/TimelinePage.css';
import { useCurrentUser } from '../contexts/UserContext';

export default function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    async function fetchFeed() {
      const data = await getUserFeed();
      setPosts(data);
    }
    fetchFeed();
  }, []);

  return (
    <div className="timeline-wrapper">
      <Sidebar />

      <div className="timeline-body">
        {/* Main Feed in the center */}
        <main className="main-feed">
          <div className="feed-title">
            <h2>Welcome back, {currentUser?.firstname}!</h2>
          </div>
          {posts.map(post => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </main>
      </div>

      <RightPanel />
    </div>
  );
}
