import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostsList from "../components/PostsList";
import CreatePost from "../components/CreatePost";

const MainPage: React.FC = () => {  
  const [refreshPosts, setRefreshPosts] = useState(false);

  // Page always loads from the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handlePostCreated = () => {    
    setRefreshPosts((prev) => !prev);   
  };
  
  return (
    <div className="container-fluid min-vh-100">
      {/* Navbar */}
      <Navbar/>      

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">       
          {/* Feed Section */}
          <div className="col-md-8">
            
            {/* Create Post Section */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Posts List */}
            <div className="mt-4"/>            
            <div className="card-body">             
              <PostsList refresh={refreshPosts} />
            </div>
          </div>        
        </div>        
      </div>      
    </div> 
  );
};

export default MainPage;