import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import NavigationBar from '../components/NavigationBar';
import FeedPostCard from '../components/PostCard';
import { getUserFeed } from '../services/feedService';
import { useCurrentUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function TimelinePage() {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [feed, setFeed] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    async function fetchInitialFeed() {
      if (currentUser?.id) {
        try {
          const posts = await getUserFeed(0, PAGE_SIZE);
          setFeed(posts);
          setPage(1);
          setHasMore(posts.length === PAGE_SIZE);
        } catch (err) {
          console.error("Failed to load initial feed", err);
        }
      }
    }
    fetchInitialFeed();
  }, [currentUser]);

  const loadMore = async () => {
    try {
      const newPosts = await getUserFeed(page, PAGE_SIZE);
      setFeed((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
      if (newPosts.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.error("Failed to load more posts", err);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="timeline-container">
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
          {feed.map((post) => (
            <FeedPostCard key={post.postId} post={post} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
