import React from "react";

const MainPage: React.FC = () => {
  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">
            Trevel
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link btn btn-danger text-white" href="#">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Categories</h5>
                <ul className="list-group">
                  <li className="list-group-item">Beaches</li>
                  <li className="list-group-item">Mountains</li>
                  <li className="list-group-item">Cities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feed Section */}
          <div className="col-md-9">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Posts</h5>
                <div className="d-flex flex-column gap-3">
                  {/* Example Post */}
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Trip to Bali 🌴</h6>
                      <p className="card-text">
                        Had an amazing time in Bali! The beaches were stunning.
                      </p>
                      <button className="btn btn-outline-primary btn-sm">
                        Like ❤️
                      </button>
                      <button className="btn btn-outline-secondary btn-sm ms-2">
                        Comment 💬
                      </button>
                    </div>
                  </div>

                  {/* More posts can be added dynamically */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
