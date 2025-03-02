import React from "react";
import Navbar from "./Navbar";
import PostsList from "./PostsList";

const MainPage: React.FC = () => {
  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row">
          {/* Feed Section */}          
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Posts</h5>
                <PostsList />
              </div>
            </div>
          </div>
        </div>
      </div>    
  );
};

export default MainPage;