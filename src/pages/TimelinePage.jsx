import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import FeedPostCard from '../components/FeedPostCard';
import { getUserFeed } from '../services/feedService';
import '../styles/TimelinePage.css';
import { useCurrentUser } from '../contexts/UserContext';

export default function TimelinePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);  // ✅ نضيف page
  const [hasMore, setHasMore] = useState(true);  // ✅ هل يوجد المزيد؟
  const { currentUser } = useCurrentUser();

  const size = 10; // عدد المنشورات في كل طلب

  useEffect(() => {
    loadMore();  // ✅ تحميل الصفحة الأولى
  }, []);

  async function loadMore() {
    try {
      const data = await getUserFeed(page, size);
      if (data.length < size) setHasMore(false);  // ✅ لو أقل من size, يعني ما في صفحات تانية
      setPosts(prev => [...prev, ...data]);  // ✅ نجمع مع المنشورات السابقة
      setPage(prev => prev + 1);  // انتقل للصفحة التالية
    } catch (err) {
      console.error("Failed to load feed:", err.message);
    }
  }

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
            <FeedPostCard key={post.postId} post={post} />
          ))}

          {/* ✅ زر تحميل المزيد */}
          {hasMore && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={loadMore}>
                Load More
              </button>
            </div>
          )}
        </main>
      </div>

      <RightPanel />
    </div>
  );
}
