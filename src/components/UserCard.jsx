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
    if (currentUser && user.id !== currentUser.id) {
      isFollowing(user.id).then(setFollowing);
    }
  }, [currentUser, user]);

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
          style={{
            backgroundColor: following ? "#efefef" : "#0095f6",
            color: following ? "#000" : "#fff"
          }}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
