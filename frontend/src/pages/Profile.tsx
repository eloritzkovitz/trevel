import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Tabs, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faMapMarkerAlt,
  faGlobe,
  faCalendarAlt,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import EditProfile from "../components/EditProfile";
import PostsList from "../components/PostsList";
import CreatePost from "../components/CreatePost";
import ImageViewer from "../components/ImageViewer";
import { useAuth } from "../context/AuthContext";
import userService, { User } from "../services/user-service";
import { getImageUrl } from "../utils/imageUrl";
import "../styles/Profile.css";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showEditProfile, setEditProfile] = useState(false);
  const [showImageViewer, setImageViewer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
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
    setImages([getImageUrl(user.profilePicture, "profile")]);
    setCurrentIndex(0);
    setImageViewer(true);
  };

  // Refresh posts when a new post is created
  const handlePostCreated = () => {
    setRefreshPosts((prev) => !prev);
  };

  // Refresh posts when the profile is updated
  const handleProfileUpdated = (updatedUser: User) => {
    setUser(updatedUser);
    setRefreshPosts((prev) => !prev);
  };

  return (
    <div className="container-fluid min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          {/* Profile Section */}
          <div className="col-md-8">
            <div className="card mb-4 panel">
              <div className="card-body text-center">
                <img
                  src={getImageUrl(user.profilePicture, "profile")}
                  className="profile-picture-1 rounded-circle mb-3"
                  alt="Profile"
                  onClick={handleProfileImageClick}
                />
                <div className="text-left">
                  <h1 className="card-title">
                    {user.firstName} {user.lastName}
                  </h1>
                  <h5 className="card-text" style={{ marginBottom: "30px" }}>
                    {user.headline || <em>No description available</em>}
                  </h5>

                  {/* Edit Profile and New Post buttons */}
                  {isOwnProfile && (
                    <>
                      <Button
                        className="profile-button"
                        variant="primary"
                        onClick={() => setEditProfile(true)}
                      >
                        <FontAwesomeIcon
                          icon={faPencil}
                          style={{ marginRight: "5px" }}
                        />
                        Edit Profile
                      </Button>
                      <div style={{ marginBottom: "20px" }}></div>
                    </>
                  )}

                  {/* Bio and Contact Information */}
                  <Tabs defaultActiveKey="about" className="mb-3 tab-content">
                    <Tab eventKey="about" title="About">
                      <div className="fixed-height-tab-content about-me">
                        <h4>About</h4>
                        <p className="card-text">
                          {user.bio || <em>No bio available</em>}
                        </p>
                      </div>
                    </Tab>
                    <Tab eventKey="contact" title="Contact Information">
                      <div className="fixed-height-tab-content contact-info">
                        <h4>Contact Information</h4>
                        <p>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />{" "}
                          {user.email}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="me-2"
                          />{" "}
                          {user.location || <em>No location available</em>}
                        </p>
                        <p>
                          <FontAwesomeIcon icon={faGlobe} className="me-2" />
                          {user.website ? (
                            <a href={user.website}>{user.website}</a>
                          ) : (
                            <em>No website available</em>
                          )}
                        </p>
                        <p>
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="me-2"
                          />{" "}
                          {user.joinDate ? (
                            new Date(user.joinDate).toLocaleDateString()
                          ) : (
                            <em>Join date not available</em>
                          )}
                        </p>
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Create Post Section */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Posts Section */}
            <div>
              <div className="card mb-2 panel-posts">
                <h4>Posts</h4>
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
    </div>
  );
};

export default Profile;
