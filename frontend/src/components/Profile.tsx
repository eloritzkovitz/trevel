import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faGlobe, faCalendarAlt, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import PostsList from "./PostsList";
import PostModal from "./PostModal";
import ImageViewer from "./ImageViewer";
import userService, { User } from "../services/user-service";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showEditProfile, setEditProfile] = useState(false);
  const [showImageViewer, setImageViewer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

  // Load page data
  useEffect(() => {
    setUser(null);
    window.scrollTo(0, 0); // Scroll to top
    if (userId) {
      userService.getUserData(userId).then(setUser).catch(console.error);      
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = loggedInUser?._id === userId;

  // Image modal for profile picture
  const handleProfileImageClick = () => {
    setImages([user.profilePicture || ""]);
    setCurrentIndex(0);
    setImageViewer(true);
  };  

  // Post modal handlers
  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);
  
  const handlePostCreated = () => {
    setShowPostModal(false);
    setRefreshPosts((prev) => !prev);
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setUser(updatedUser);
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          {/* Profile Section */}
          <div className="col-md-8">
            <div className="card mb-4" style= {{boxShadow: '0 5px 5px -5px rgba(0, 0, 0, 0.2)'}}>
              <div className="card-body text-center">
                <img
                  src={user.profilePicture} 
                  className="profile-picture-1 rounded-circle mb-3" 
                  alt="Profile"                  
                  onClick={handleProfileImageClick}
                />
                <div className="text-left">
                  <h1 className="card-title">{user.firstName} {user.lastName}</h1>
                  <h5 className="card-text" style={{ marginBottom: '30px' }}>{user.headline || <em>No description available</em>}</h5>
                  <div className="border-top border-primary"></div>
                  <h5 className="card-title mt-3">About Me</h5>
                  <p className="card-text" style={{ marginBottom: '30px' }}>{user.bio || <em>No bio available</em>}</p> 
                  <div className="border-top border-primary"></div>
                  <h5 className="card-title mt-3">Contact Information</h5>
                  <p className="card-text">
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '5px' }} /> {user.email}
                  </p>
                  <p className="card-text">
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '5px' }} /> {user.location || <em>No location available</em>}
                  </p>
                  <p className="card-text">
                    <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '5px' }} /> 
                    {user.website ? (
                      <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a>
                    ) : (
                      <em>No website available</em>
                    )}
                  </p>
                  <p className="card-text" style={{ marginBottom: '50px' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} /> {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : <em>Join date not available</em>}
                  </p>
                  {isOwnProfile && (
                    <>
                      <Button variant="primary" style={{ marginRight: '10px' }} onClick={handleShowPostModal}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                        New Post
                      </Button>
                      <Button variant="primary" onClick={() => setEditProfile(true)}>
                        <FontAwesomeIcon icon={faPencil} style={{ marginRight: '5px' }} />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div>
              <div className="card mb-2" style={{ height: '70px', boxShadow: '0 5px 5px -5px rgba(0, 0, 0, 0.2)' }}>
                <h4 style={{ marginTop: '15px', marginLeft: '15px' }}>Posts</h4>
              </div>
              <div>                
                <PostsList userId={userId} refresh={refreshPosts} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          show={showEditProfile}
          handleClose={() => setEditProfile(false)}          
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Image Modal */}
      <ImageViewer 
        show={showImageViewer}        
        images={images}
        currentIndex={currentIndex}
        onClose={() => setImageViewer(false)}        
      />

      {/* Post Modal */}
      <PostModal 
        show={showPostModal} 
        handleClose={handleClosePostModal} 
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Profile;