import React, { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import FeedPostCard from '../components/PostCard';
import { getUserFeed } from '../services/feedService';
import { useCurrentUser } from '../contexts/UserContext';

export default function TimelinePage() {
  const { currentUser: user } = useCurrentUser();
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    async function fetchFeed() {
      if (user?.id) {
        const posts = await getUserFeed(user.id);
        setFeed(posts);
      }
    }
    fetchFeed();
  }, [user]);

  return (
    <div>
      <NavigationBar />
      <div className="timeline-container">
        {feed.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '30px' }}>No posts in your timeline yet.</p>
        ) : (
          feed.map(post => <FeedPostCard key={post.postId} post={post} />)
        )}
      </div>
    </div>
  );
}
