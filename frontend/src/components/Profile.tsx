import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import PostsList from "./PostsList";
import userService, { User } from "../services/user-service";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: loggedInUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

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
                  alt="ProfilePicture" 
                  style={{ width: '100px', height: '100px' }} 
                />
                <h4 className="card-title">{user.firstName} {user.lastName}</h4>
                <p className="card-text">Travel Enthusiast | Blogger</p>
                {isOwnProfile && <button className="btn btn-primary">Edit Profile</button>}
              </div>
            </div>

            {/* Posts Section */}
            {/* <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Posts</h5>
                <PostsList sender={userId} />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;