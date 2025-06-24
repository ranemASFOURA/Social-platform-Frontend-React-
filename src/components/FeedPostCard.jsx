import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { getUserById } from '../services/userService';
import { timeAgo } from '../utils/timeAgo';
import { useNavigate } from 'react-router-dom';
import { convertToCDN } from '../utils/convertToCDN';
import '../styles/FeedPostCard.css';

export default function FeedPostCard({ post }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const toggleLike = () => setLiked(prev => !prev);

  useEffect(() => {
    async function fetchUser() {
      const data = await getUserById(post.userId);
      setUser(data);
    }
    fetchUser();
  }, [post.userId]);

  return (
    <div className="feed-post-card-advanced">
      {/* Left: Post Image */}
      <div className="feed-post-image-section">
        <img
          src={convertToCDN(post.imageUrl)}
          alt={post.caption}
          className="feed-post-image-large"
        />

        {/* Action Icons on the right of the image */}
        <div className="feed-post-icons">
          <Heart
        className={`icon ${liked ? 'liked' : ''}`}
        onClick={toggleLike}
      />
          <MessageCircle className="icon" />
          <Send className="icon" />
          <Bookmark className="icon" />
        </div>
      </div>

      {/* Right: Caption, User info, and Comment input */}
      <div className="feed-post-details-section">
        {/* User Info */}
        <div
          className="feed-post-user"
          onClick={() => user && navigate(`/profile/${user.id}`)}
        >
          <img
            src={convertToCDN(user?.imageUrl) || "/default-avatar.png"}
            alt="User"
            className="avatar-sm"
          />
          <div className="user-meta">
            <strong>{user ? `${user.firstname} ${user.lastname}` : post.userId}</strong>
            <span className="timestamp">{timeAgo(post.timestamp)}</span>
          </div>
        </div>

        {/* Caption */}
        <div className="feed-post-caption">
          <p>{post.caption}</p>
        </div>

        {/* Add Comment Input */}
        <div className="feed-post-comment-box">
          <input type="text" placeholder="Add a comment..." className="comment-input" />
        </div>
      </div>
    </div>
  );
}
