import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faGlobe, faCalendarAlt, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import PostsList from "./PostsList";
import ImageModal from "./ImageModal";
import userService, { User } from "../services/user-service";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load page data
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top
    if (userId) {
      userService.getUserData(userId).then(setUser).catch(console.error);
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = loggedInUser?._id === userId;

  // Image modal
  const handleImageClick = () => {
    setImageUrl(user.profilePicture || null);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setImageUrl(null);
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
            <div className="card mb-4">
              <div className="card-body text-center">
                <img 
                  src={user.profilePicture} 
                  className="rounded-circle mb-3" 
                  alt="Profile" 
                  style={{ width: '180px', height: '180px', cursor: 'pointer' }} 
                  onClick={handleImageClick}
                />
                <div className="text-left">
                  <h1 className="card-title">{user.firstName} {user.lastName}</h1>
                  <h5 className="card-text" style = {{marginBottom: '30px'}}>{user.headline || <em>No description available</em>}</h5>
                  <div className="border-top border-primary"></div>
                  <h5 className="card-title mt-3">About Me</h5>
                  <p className="card-text" style = {{marginBottom: '30px'}}>{user.bio || <em>No bio available</em>}</p> 
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
                  <p className="card-text" style = {{marginBottom: '50px'}}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} /> {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : <em>Join date not available</em>}
                  </p>
                  {isOwnProfile && (
                    <>
                      <Button variant="primary" style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '5px' }} />
                        New Post
                      </Button>
                      <Button variant="primary" onClick={() => setIsEditProfileOpen(true)}>
                        <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Posts</h5>
                <PostsList userId={userId} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <EditProfile
          show={isEditProfileOpen}
          handleClose={() => setIsEditProfileOpen(false)}
          onUpdate={setUser}
        />
      )}

      {/* Image Modal */}
      <ImageModal 
        show={isImageModalOpen}
        title="Profile Picture"
        imageUrl={imageUrl} 
        handleClose={handleCloseImageModal} 
      />
    </div>
  );
};

export default Profile;