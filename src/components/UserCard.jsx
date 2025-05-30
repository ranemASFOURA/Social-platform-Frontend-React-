import React, { useEffect, useState } from 'react';
import '../styles/UserCard.css';
import defaultAvatar from '../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser, isFollowing } from '../services/followService';
import { useCurrentUser } from '../contexts/UserContext';

export default function UserCard({ user }) {
  const { currentUser } = useCurrentUser();
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkFollow() {
      if (currentUser && user.id !== currentUser.id) {
        const result = await isFollowing(currentUser.id, user.id);
        setFollowing(result);
      }
    }
    checkFollow();
  }, [currentUser, user]);

  const handleFollowToggle = async () => {
    if (!currentUser || user.id === currentUser.id) return;

    if (following) {
      const success = await unfollowUser(currentUser.id, user.id);
      if (success) setFollowing(false);
    } else {
      const success = await followUser(currentUser.id, user.id);
      if (success) setFollowing(true);
    }
  };

  return (
    <div className="user-card">
      <div
  className="user-card-left"
  onClick={() => {
  if (window.location.pathname !== `/profile/${user.id}`) {
    navigate(`/profile/${user.id}`);
  }
}}
  style={{ cursor: "pointer" }}
>

        <img
          src={user.imageUrl || defaultAvatar}
          alt="User avatar"
          className="user-card-avatar"
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
          style={{ backgroundColor: following ? "#efefef" : "#0095f6", color: following ? "#000" : "#fff" }}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
