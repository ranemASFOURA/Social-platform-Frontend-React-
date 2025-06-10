import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NavigationBar from '../components/NavigationBar';
import FeedPostCard from '../components/PostCard';
import { getUserFeed } from '../services/feedService';
import { useCurrentUser } from '../contexts/UserContext';

export default function TimelinePage() {
  const { currentUser: user } = useCurrentUser();
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
  async function fetchInitialFeed() {
    if (user?.id) {
      const posts = await getUserFeed(user.id, 0, PAGE_SIZE);
      setFeed(posts);
      setPage(1); 
      setHasMore(posts.length === PAGE_SIZE);
    }
  }
  fetchInitialFeed();
}, [user]);


  async function loadMore() {
  const posts = await getUserFeed(user.id, page, PAGE_SIZE);
  if (posts.length < PAGE_SIZE) {
    setHasMore(false);
  }
  setFeed(prev => [...prev, ...posts]);
  setPage(prev => prev + 1);
}



  return (
    <div>
      <NavigationBar />
      <div className="timeline-container">
        {feed.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '30px' }}>No posts in your timeline yet.</p>
        ) : (
          feed.map(post => <FeedPostCard key={post.postId} post={post} />)
        )}
        <InfiniteScroll
  dataLength={feed.length}
  next={loadMore}
  hasMore={hasMore}
  loader={<h4 style={{ textAlign: 'center' }}>Loading...</h4>}
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>No more posts to show.</b>
    </p>
  }
>
  {feed.map(post => <FeedPostCard key={post.postId} post={post} />)}
</InfiniteScroll>

      </div>
    </div>
  );
}
