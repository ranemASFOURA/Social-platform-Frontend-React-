//import React from 'react';
import React, { useEffect, useState } from 'react';
import '../styles/UserCard.css';
import defaultAvatar from '../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser, isFollowing } from '../services/followService';
import { useCurrentUser } from '../contexts/UserContext';
import { loadImageFromGateway } from '../utils/imageLoader';

export default function UserCard({ user }) {
  const { currentUser } = useCurrentUser();
  const [following, setFollowing] = React.useState(false);
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);

  React.useEffect(() => {
    if (currentUser && user.id !== currentUser.id) {
      isFollowing(user.id).then(setFollowing);
    }
  }, [currentUser, user]);

  useEffect(() => {
    if (user?.imageUrl) {
      const processedUrl = loadImageFromGateway(user.imageUrl);
      setAvatarUrl(processedUrl);
    }
  }, [user]);

  const handleFollowToggle = async () => {
    if (!currentUser || user.id === currentUser.id) return;

    const success = following
      ? await unfollowUser(user.id)
      : await followUser(user.id);

    if (success) setFollowing(!following);
  };

  return (
    <div className="user-card">
      <div
        className="user-card-left"
        onClick={() => navigate(`/profile/${user.id}`)}
        style={{ cursor: "pointer" }}
      >
        <img
        src={avatarUrl || defaultAvatar}
        alt="avatar"
        className="avatar"
        onClick={(e) => e.stopPropagation()}
      />
        <div className="user-card-info">
          <h4>{user.firstname} {user.lastname}</h4>
          <p>{user.email}</p>
        </div>
      </div>

      {user.id !== currentUser?.id && (
        <button
          className="follow-btn"
          onClick={handleFollowToggle}
          style={{
            backgroundColor: following ? "#E2CAD8" : "#C18DB4",
            color: following ? "#0E1B48" : "#fff"
          }}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
