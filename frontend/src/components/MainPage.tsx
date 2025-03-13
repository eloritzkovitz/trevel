import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PostsList from "./PostsList";
import PostModal from "./PostModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const MainPage: React.FC = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);

  // Page always loads from the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);
  const handlePostCreated = () => {
    setShowPostModal(false); 
    setRefreshPosts((prev) => !prev);   
  };
  
  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <Navbar/>

      {/* Floating Action Button */}
      <button
        className="btn btn-primary fab"
        onClick={handleShowPostModal}
        title="Create Post"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">       
          {/* Feed Section */}
          <div className="col-md-8">
            <div className="card-body">             
              <PostsList refresh={refreshPosts} />
            </div>
          </div>        
        </div>        
      </div>

      {/* Post Modal */}
      <PostModal 
        show={showPostModal} 
        handleClose={handleClosePostModal} 
        onPostCreated={handlePostCreated}
      />
    </div> 
  );
};

export default MainPage;