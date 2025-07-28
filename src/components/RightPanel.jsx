import '../styles/RightPanel.css';
import { useEffect, useState } from 'react';
import { getFollowSuggestions } from '../services/searchService';
import { isFollowing, followUser, unfollowUser } from '../services/followService';
import { useCurrentUser } from '../contexts/UserContext';
import defaultAvatar from '../assets/default-avatar.png';
import { loadImageFromGateway } from '../utils/imageLoader';
import { useNavigate } from 'react-router-dom';


export default function RightPanel() {
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser } = useCurrentUser();
  const [avatars, setAvatars] = useState({});
  const navigate = useNavigate();


useEffect(() => {
  if (!currentUser) return;
  async function fetchSuggestions() {
    try {
      const result = await getFollowSuggestions();
      const withFollowState = await Promise.all(
        result.map(async (user) => {
          const following = await isFollowing(user.id);
          return { ...user, following };
        })
      );
      setSuggestions(withFollowState);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }

  fetchSuggestions();
}, [currentUser]);

useEffect(() => {
  const fetchAvatars = async () => {
    const updates = {};

    await Promise.all(suggestions.map(async (user) => {
      if (user.imageUrl && !avatars[user.id]) {
        try {
          const blobUrl = await loadImageFromGateway(user.imageUrl);
          updates[user.id] = blobUrl;
        } catch (err) {
          console.error("Failed to load image for user", user.id, err);
        }
      }
    }));

    if (Object.keys(updates).length > 0) {
      setAvatars(prev => ({ ...prev, ...updates }));
    }
  };

  fetchAvatars();
}, [suggestions]);


const handleToggleFollow = async (userId) => {
  const index = suggestions.findIndex((u) => u.id === userId);
  if (index === -1) return;

  const user = suggestions[index];
  const success = user.following
    ? await unfollowUser(userId)
    : await followUser(userId);

  if (success) {
    const updated = [...suggestions];
    updated[index] = { ...user, following: !user.following };
    setSuggestions(updated);
  }
};

  return (
    <div className="right-panel">
  <h3 className="suggestions-title">For You to Follow</h3>

  {suggestions.map(user => (
  <div className="suggestion-card" key={user.id}>
    <img
  src={avatars[user.id] || defaultAvatar}
  alt={user.username}
  className="suggestion-avatar"
  onError={(e) => {
    console.error("Failed to load avatar for", user.username);
    e.target.src = defaultAvatar;
  }}
/>

    <div className="suggestion-info">
      <p className="suggestion-name">{user.firstname} {user.lastname}</p>
      <p className="suggestion-meta">{user.followersCount ?? 0} followers · {user.postsCount ?? 0} posts</p>
      <div className="suggestion-buttons">
        <button
  className="follow-btn"
  style={{
    backgroundColor: user.following ? "#E2CAD8" : "#C18DB4",
    color: user.following ? "#0E1B48" : "#fff"
  }}
  onClick={() => handleToggleFollow(user.id)}
>
  {user.following ? "Unfollow" : "Follow"}
</button>

        <button className="about-btn">About</button>
      </div>
    </div>
  </div>
))}

</div>

  );
}
