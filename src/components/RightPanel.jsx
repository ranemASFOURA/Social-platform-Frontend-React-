import '../styles/RightPanel.css';
import { useEffect, useState } from 'react';
import { getFollowSuggestions } from '../services/searchService';
import { isFollowing, followUser, unfollowUser } from '../services/followService';
import defaultAvatar from '../assets/default-avatar.png';



export default function RightPanel() {
  const [suggestions, setSuggestions] = useState([]);


useEffect(() => {
  async function fetchSuggestions() {
    try {
      const result = await getFollowSuggestions();
      setSuggestions(result);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }

  fetchSuggestions();
}, []);

useEffect(() => {
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
}, []);

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
    <img src={user.imageUrl || "/default-avatar.png"} alt={user.username} className="suggestion-avatar" />
    <div className="suggestion-info">
      <p className="suggestion-name">{user.firstname} {user.lastname}</p>
      <p className="suggestion-meta">{user.followersCount || 0} followers · {user.postsCount || 0} posts</p>
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
