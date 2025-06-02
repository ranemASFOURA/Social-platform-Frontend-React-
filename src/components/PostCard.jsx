import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { getUserById } from '../services/userService';
import { timeAgo } from '../utils/timeAgo';
import { useNavigate } from 'react-router-dom';

export default function FeedPostCard({ post }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserById(post.userId);
      setUser(data);
    }
    fetchUser();
  }, [post.userId]);

  return (
    <div className="feed-post-card">
      <div
        className="feed-post-header"
        onClick={() => user && navigate(`/profile/${user.id}`)}
      >
        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt="User"
          className="avatar"
        />
        <strong className="username">{user ? `${user.firstname} ${user.lastname}` : post.userId}</strong>
      </div>

      <img src={post.imageUrl} alt={post.caption} className="feed-post-image" />

      <div className="feed-post-actions">
        <Heart className="icon" />
        <MessageCircle className="icon" />
        <Send className="icon" />
        <Bookmark className="icon save" />
      </div>

      <p className="caption">
        <strong>{user ? user.firstname : post.userId}</strong> {post.caption}
      </p>

      <p className="timestamp">{timeAgo(post.timestamp)}</p>

      <input className="comment-input" placeholder="Add a comment..." />
    </div>
  );
}
