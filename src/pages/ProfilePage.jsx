import React, { useEffect, useState, useRef } from 'react';
import NavigationBar from '../components/NavigationBar';
import defaultAvatar from '../assets/default-avatar.png';
import '../styles/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { getFollowers, getFollowing } from '../services/followService';
import { getUserById } from '../services/userService';
import { getPostsByUser } from '../services/postService';


export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showPopup, setShowPopup] = useState(null); // 'followers' | 'following' | null
  const popupRef = useRef(null);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    async function fetchFollowStats() {
      if (user) {
        const rawFollowers = await getFollowers(user.id);
        const rawFollowing = await getFollowing(user.id);

        const followersData = await Promise.all(rawFollowers.map(f => getUserById(f.followerId)));
        const followingData = await Promise.all(rawFollowing.map(f => getUserById(f.followingId)));

        setFollowers(followersData);
        setFollowing(followingData);
      }
    }
    fetchFollowStats();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  async function fetchData() {
    if (user) {
      const userPosts = await getPostsByUser(user.id);
      setPosts(userPosts);
    }
  }
  fetchData();
}, [user]);


  if (!user) return <div>Please sign in first.</div>;

  return (
    <div>
      <NavigationBar />
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={user.imageUrl || defaultAvatar}
            alt="avatar"
            className="profile-avatar"
          />

          <div className="profile-info">
            <div className="profile-top">
              <h2>{user.firstname} {user.lastname}</h2>

              <div className="follow-inline-stats">
                <span onClick={() => setShowPopup('followers')}>Followers: {followers.length}</span>
                <span onClick={() => setShowPopup('following')}>Following: {following.length}</span>
              </div>
            </div>

            <p>{user.email}</p>

            <button className="edit-button" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </button>

            {showPopup && (
              <div className="follow-popup-box" ref={popupRef}>
                <h4>{showPopup === 'followers' ? 'Followers' : 'Following'}</h4>
                <ul>
                  {(showPopup === 'followers' ? followers : following).map(u => (
                    <li key={u.id}>
                      <img src={u.imageUrl || defaultAvatar} alt="avatar" />
                      <div>
                        <strong>{u.firstname} {u.lastname}</strong>
                        <p>{u.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
            )}
          </div> 
        </div>
        <div className="post-grid">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <img src={post.imageUrl} alt={post.caption} />
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
