import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import PostsList from "./PostsList";
import userService, { User } from "../services/user-service";
import { useAuth } from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faGlobe, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      userService.getUserData(userId).then(setUser).catch(console.error);
    }
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isOwnProfile = loggedInUser?._id === userId;

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          {/* Profile Section */}
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img 
                  src={user.profilePicture} 
                  className="rounded-circle mb-3" 
                  alt="Profile" 
                  style={{ width: '100px', height: '100px' }} 
                />
                <h4 className="card-title">{user.firstName} {user.lastName}</h4>
                <p className="card-text">{user.bio || <em>No bio available</em>}</p>
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
                <p className="card-text">
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '5px' }} /> {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : <em>Join date not available</em>}
                </p>
                {isOwnProfile && (
                  <>
                    <Button variant="primary" style={({ marginRight: '10px' })}>
                      New Post
                    </Button>
                    <Button variant="primary" onClick={() => setIsEditProfileOpen(true)}>
                      Edit Profile
                    </Button>
                  </>
                )}
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
    </div>
  );
};

export default Profile;