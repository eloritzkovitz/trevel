import React from "react";
import Navbar from "./Navbar";
import PostsList from "./PostsList";

const Signup: React.FC = () => {
  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row justify-content-center">
          {/* Profile Section */}
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img src="https://via.placeholder.com/150" className="rounded-circle mb-3" alt="UserPhoto" />
                <h4 className="card-title">User</h4>
                <p className="card-text">Travel Enthusiast | Blogger</p>
              </div>
            </div>

            {/* Posts Section */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Posts</h5>
                <PostsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;