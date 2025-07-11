// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import FollowPopup from '../components/FollowPopup';
import ImageModal from '../components/ImageModal';
import PrimaryButton from '../components/PrimaryButton';
import { Pencil } from 'lucide-react';
import defaultAvatar from '../assets/default-avatar.png';
import { useCurrentUser } from '../contexts/UserContext';
import { getUserById, updateUser } from '../services/userService';
import { getFollowers, getFollowing, followUser, unfollowUser, isFollowing } from '../services/followService';
import { getPostsByUser } from '../services/postService';
import { loadImageFromGateway } from '../utils/imageLoader';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
  const { id } = useParams(); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useCurrentUser();
  const [postImages, setPostImages] = useState({});


  const [profileUser, setProfileUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [popupUsers, setPopupUsers] = useState([]);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [showBioEditor, setShowBioEditor] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  const isCurrentUser = profileUser?.id === currentUser?.id;
  const shouldReloadPosts = location.state?.reloadPosts || false;

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setProfileUser(null);
    setFollowers([]);
    setFollowing([]);
    setPosts([]);
    setIsFollowingUser(false);
  }, [id]);

  useEffect(() => {
  async function fetchUser() {
    const targetId = id || currentUser?.id;
    if (!targetId || profileUser?.id === targetId) return;
    const data = await getUserById(targetId);
    setProfileUser(data);
    setBioInput(data.bio || '');

    // تحميل الصورة من خلال gateway
    if (data.imageUrl) {
      try {
        const url = await loadImageFromGateway(data.imageUrl);
        setAvatarUrl(url);
      } catch (err) {
        console.error("❌ Failed to load profile image:", err);
        setAvatarUrl(null);
      }
    } else {
      setAvatarUrl(null);
    }
  }

  fetchUser();
}, [id, currentUser]);

  useEffect(() => {
    async function fetchFollowData() {
      const targetId = id || currentUser?.id;
      if (!targetId) return;
      try {
        const rawFollowers = await getFollowers(targetId);
        const rawFollowing = await getFollowing(targetId);
        setFollowers(Array.isArray(rawFollowers) ? rawFollowers.map(f => f.followerId) : []);
        setFollowing(Array.isArray(rawFollowing) ? rawFollowing.map(f => f.followingId) : []);
      } catch (err) {
        console.error('Failed to fetch follow data', err);
      }
    }
    fetchFollowData();
  }, [id, currentUser]);

  useEffect(() => {
    if (!showPopup) return;
    const ids = showPopup === 'followers' ? followers : following;
    Promise.all(ids.map(getUserById)).then(setPopupUsers);
  }, [showPopup]);

  useEffect(() => {
  const targetId = id || currentUser?.id;
  if (profileUser && targetId) {
    getPostsByUser(targetId).then(async res => {
      const postList = res.content || [];
      setPosts(postList);

      const loadedImages = {};
      await Promise.all(
        postList.map(async post => {
          if (post.imageUrl) {
            try {
              const imgUrl = await loadImageFromGateway(post.imageUrl);
              loadedImages[post.id] = imgUrl;
            } catch (err) {
              console.error(`❌ Failed to load post image for ${post.id}`, err);
              loadedImages[post.id] = null;
            }
          }
        })
      );
      setPostImages(loadedImages);
    });
  }

  if (shouldReloadPosts) window.history.replaceState({}, document.title);
}, [id, currentUser, profileUser, shouldReloadPosts]);


  useEffect(() => {
    if (currentUser && profileUser && currentUser.id !== profileUser.id) {
      isFollowing(profileUser.id).then(setIsFollowingUser);
    }
  }, [currentUser, profileUser]);

  const handleSaveBio = async () => {
    const updated = await updateUser({ bio: bioInput });
    setProfileUser(updated);
    setShowBioEditor(false);
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !profileUser || currentUser.id === profileUser.id) return;
    const success = isFollowingUser
      ? await unfollowUser(profileUser.id)
      : await followUser(profileUser.id);
    if (success) setIsFollowingUser(!isFollowingUser);
  };

  if (!profileUser) return <div>Loading profile...</div>;

  return (
    <div className="timeline-wrapper">
      <Sidebar />

      <div className="profile-center">
        <div className="profile-main-container">
          <div className="profile-summary">
            <img
  src={avatarUrl || defaultAvatar}
  alt="Avatar"
  className="profile-avatar"
/>

            <div className="profile-text-info">
              <h2 className="profile-name">{profileUser.firstname} {profileUser.lastname}</h2>
              <div className="bio-row">
                {profileUser.bio && <p className="user-bio">{profileUser.bio}</p>}
                {isCurrentUser && (
                  <button className="edit-bio-button" onClick={() => setShowBioEditor(true)}>
                    <Pencil size={16} color="#0E1B48" />
                  </button>
                )}
              </div>
              <p className="user-email">{profileUser.email}</p>
            </div>

            <div className="center-section centered-stats">
              <div className="follow-stats">
                <div className="stat-block">
                  <span className="stat-label">Followers</span>
                  <span className="stat-value" onClick={() => setShowPopup('followers')}>{followers.length}</span>
                </div>
                <div className="stat-block">
                  <span className="stat-label">Following</span>
                  <span className="stat-value" onClick={() => setShowPopup('following')}>{following.length}</span>
                </div>
              </div>
            </div>
            <div className="edit-button-wrapper">
  {isCurrentUser ? (
    <PrimaryButton onClick={() => navigate('/edit-profile')}>
      Edit profile
    </PrimaryButton>
  ) : (
    <PrimaryButton
      onClick={handleFollowToggle}
      style={{
        backgroundColor: isFollowingUser ? "#E2CAD8" : "#C18DB4",
        color: isFollowingUser ? "#0E1B48" : "#fff"
      }}
    >
      {isFollowingUser ? "Unfollow" : "Follow"}
    </PrimaryButton>
  )}
</div>

          </div>

          {showBioEditor && (
            <div className="bio-editor">
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={3}
                placeholder="Write something about yourself..."
              />
              <button onClick={handleSaveBio}>Save</button>
            </div>
          )}

          {showPopup && (
            <FollowPopup
              title={showPopup === 'followers' ? 'Followers' : 'Following'}
              users={popupUsers}
              onClose={() => setShowPopup(null)}
            />
          )}

          <div className="profile-posts-tabs">
            <button className="tab-button active">POSTS</button>
            <button className="tab-button" disabled>SAVED</button>
            <button className="tab-button" disabled>TAGGED</button>
          </div>

          <div className="post-grid">
            {posts.map(post => (
              <div
                key={post.id}
                className="post-grid-item"
                onClick={() => {
                  setSelectedImage(post.imageUrl);
                  setSelectedCaption(post.caption);
                }}
              >
                <img src={postImages[post.id] || defaultAvatar} alt={post.caption} />
              </div>
            ))}
          </div>

          {selectedImage && (
            <ImageModal
              imageUrl={selectedImage}
              caption={selectedCaption}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </div>
      </div>

      <RightPanel />
    </div>
  );
}