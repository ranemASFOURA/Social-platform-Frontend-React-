import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import defaultAvatar from '../assets/default-avatar.png';
import '../styles/ProfilePage.css';
import { getFollowers, getFollowing, followUser, unfollowUser, isFollowing } from '../services/followService';
import { getUserById } from '../services/userService';
import { getPostsByUser } from '../services/postService';
import { useCurrentUser } from '../contexts/UserContext';
import FollowPopup from '../components/FollowPopup';

export default function ProfilePage() {
  const { id } = useParams(); 
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReloadPosts = location.state?.reloadPosts || false;

  const [profileUser, setProfileUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [popupUsers, setPopupUsers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0); 
    setProfileUser(null);
    setFollowers([]);
    setFollowing([]);
    setPosts([]);
    setIsFollowingUser(false);
  }, [id]);

  useEffect(() => {
    async function fetchProfileUser() {
      const targetId = id || currentUser?.id;
      if (!targetId || profileUser?.id === targetId) return;
      const userData = await getUserById(targetId);
      setProfileUser(userData);
    }
    fetchProfileUser();
  }, [id, currentUser]);

  useEffect(() => {
    async function fetchFollowStats() {
      const targetId = id || currentUser?.id;
      if (!targetId) return;
      const rawFollowers = await getFollowers(targetId);
      const rawFollowing = await getFollowing(targetId);

      setFollowers(rawFollowers.map(f => f.followerId));
      setFollowing(rawFollowing.map(f => f.followingId));
    }
    fetchFollowStats();
  }, [id, currentUser]);

  useEffect(() => {
    async function fetchPopupUsers() {
      const ids = showPopup === 'followers' ? followers : following;
      const data = await Promise.all(ids.map(getUserById));
      setPopupUsers(data);
    }
    if (showPopup) fetchPopupUsers();
  }, [showPopup]);

  useEffect(() => {
    async function fetchPosts() {
      const targetId = id || currentUser?.id;
      if (!targetId) return;
      const userPosts = await getPostsByUser(targetId);
      setPosts(userPosts.content || []);
    }
    if (profileUser) {
      fetchPosts();
    }
    if (shouldReloadPosts) {
      window.history.replaceState({}, document.title);
    }
  }, [id, currentUser, profileUser, shouldReloadPosts]);

  useEffect(() => {
    async function checkFollow() {
      if (currentUser && profileUser && currentUser.id !== profileUser.id) {
        const following = await isFollowing(currentUser.id, profileUser.id);
        setIsFollowingUser(following);
      }
    }
    checkFollow();
  }, [currentUser, profileUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser || currentUser.id === profileUser.id) return;

    if (isFollowingUser) {
      const success = await unfollowUser(currentUser.id, profileUser.id);
      if (success) setIsFollowingUser(false);
    } else {
      const success = await followUser(currentUser.id, profileUser.id);
      if (success) setIsFollowingUser(true);
    }
  };

  if (!profileUser) return <div>Loading profile...</div>;

  const isCurrentUser = profileUser.id === currentUser?.id;

  return (
    <div>
      <NavigationBar />
      <div className="profile-main-container">
        <div className="profile-summary">
          <img
            src={profileUser.imageUrl || defaultAvatar}
            alt="avatar"
            className="profile-avatar-large"
          />
          <div className="profile-text-info">
            <div className="profile-username-row">
              <h2>{profileUser.firstname} {profileUser.lastname}</h2>
              {isCurrentUser ? (
                <button className="edit-button" onClick={() => navigate('/edit-profile')}>
                  Edit profile
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={handleFollowToggle}
                  style={{ backgroundColor: isFollowingUser ? "#efefef" : "#0095f6", color: isFollowingUser ? "#000" : "#fff" }}
                >
                  {isFollowingUser ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>

            <div className="profile-follow-stats">
              <span onClick={() => setShowPopup('followers')}>{followers.length} followers</span>
              <span onClick={() => setShowPopup('following')}>{following.length} following</span>
              <span>{posts.length} posts</span>
            </div>
            <p>{profileUser.email}</p>
          </div>

          {showPopup && (
            <FollowPopup
              title={showPopup === 'followers' ? 'Followers' : 'Following'}
              users={popupUsers}
              onClose={() => setShowPopup(null)}
            />
          )}
        </div>

        <div className="profile-posts-tabs">
          <button className="tab-button active">POSTS</button>
          <button className="tab-button" disabled>SAVED</button>
          <button className="tab-button" disabled>TAGGED</button>
        </div>

        <div className="post-grid">
          {posts.map(post => (
            <div key={post.id} className="post-grid-item">
              <img src={post.imageUrl} alt={post.caption} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
