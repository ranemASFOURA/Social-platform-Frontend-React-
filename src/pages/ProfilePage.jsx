import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import defaultAvatar from '../assets/default-avatar.png';
import '../styles/ProfilePage.css';
import { getFollowers, getFollowing } from '../services/followService';
import { getUserById } from '../services/userService';
import { getPostsByUser } from '../services/postService';
import { followUser, unfollowUser, isFollowing } from '../services/followService';
import { useCurrentUser } from '../contexts/UserContext';


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
  const popupRef = useRef(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState(null);
  const [fetchedFollowerDetails, setFetchedFollowerDetails] = useState([]);
const [fetchedFollowingDetails, setFetchedFollowingDetails] = useState([]);




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
    if (showPopup === 'followers') {
      const data = await Promise.all(followers.map(id => getUserById(id)));
      setFetchedFollowerDetails(data);
    } else if (showPopup === 'following') {
      const data = await Promise.all(following.map(id => getUserById(id)));
      setFetchedFollowingDetails(data);
    }
  }

  if (showPopup) fetchPopupUsers();
}, [showPopup]);


  
  useEffect(() => {
  async function fetchPosts() {
    const targetId = id || currentUser?.id;
    if (!targetId) return;
    const userPosts = await getPostsByUser(targetId);
    setPosts(userPosts);
    setLoadedUserId(targetId);
  }

  if (profileUser) {
    fetchPosts();
  }

  if (shouldReloadPosts) {
    window.history.replaceState({}, document.title);
    setLoadedUserId(null);
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

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!profileUser) return <div>Loading profile...</div>;

  const isCurrentUser = profileUser.id === currentUser?.id;
  console.log("Logged-in User ID:", currentUser?.id);
console.log("Profile Page User ID:", profileUser?.id);


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
            <div className="follow-popup-container">
              <div className="follow-popup-box" ref={popupRef}>
                <h4>{showPopup === 'followers' ? 'Followers' : 'Following'}</h4>
                <ul>
                  {(showPopup === 'followers' ? fetchedFollowerDetails : fetchedFollowingDetails).map(u => (
  <li key={u.id} className="popup-user-item" onClick={() => navigate(`/profile/${u.id}`)} style={{ cursor: "pointer" }}>
    <img src={u.imageUrl || defaultAvatar} alt="avatar" />
    <div>
      <strong>{u.firstname} {u.lastname}</strong>
      <p>{u.email}</p>
    </div>
  </li>
))}

                </ul>
              </div>
            </div>
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
