import React from "react";
import "../styles/MainPage.css";

const MainPage: React.FC = () => {
  return (
    <div className="main-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="navbar-title">Travel Share</h1>
          <button className="navbar-button">Login</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content-container container mx-auto">
        {/* Sidebar */}
        <aside className="sidebar hidden md:block">
          <h2>Filters</h2>
          <p>(Placeholder for filters)</p>
        </aside>

        {/* Feed */}
        <main className="feed">
          <h2>Recent Travel Posts</h2>
          <p>(Placeholder for posts)</p>
        </main>
      </div>
    </div>
  );
};

export default MainPage;