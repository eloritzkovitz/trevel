import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, InputGroup} from "react-bootstrap";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHome, faPlane, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/Navbar.css";

const NavigationBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar
      className="navbar"      
      variant="light"
      expand="lg"
      fixed="top"      
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="ms-3 brand">
          <img src={logo} alt="Trevel Logo" />
        </Navbar.Brand>

        {/* Search */}
        <Form
          className="d-flex ms-auto position-relative search-bar-form"          
        >
          <InputGroup>
            <FontAwesomeIcon
              icon={faSearch}
              className="position-absolute text-muted search-bar-icon"
            />
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2 rounded-pill ps-5 search-bar"
              aria-label="Search"              
            />
          </InputGroup>
        </Form>

        {/* Menu */}
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse
          id="navbarNav"
          className="d-flex justify-content-between w-100">         
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link d-flex flex-column align-items-center mr-15 ${location.pathname === "/" ? "active text-primary" : ""}`}              
            >
              <FontAwesomeIcon className="navbar-icon" icon={faHome} />
              <span>Home</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/trips"
              className={`nav-link d-flex flex-column align-items-center mr-15 ${location.pathname === "/trips" ? "active text-primary" : ""}`}              
            >
              <FontAwesomeIcon className="navbar-icon" icon={faPlane} />
              <span>Trips</span>
            </Nav.Link>
          </Nav>

          {/* Profile Dropdown */}
          {user && (
            <NavDropdown
              title={
                <>
                  <img
                    className="profile-picture-3 rounded-circle"
                    src={user.profilePicture}
                    alt="Profile"                    
                  />
                </>
              }
              id="navbarDropdown"
              align="end"
              className="ms-5"
            >
              <NavDropdown.Item>
                <>
                  <img
                    className="profile-picture-3 rounded-circle mr-10"
                    src={user.profilePicture}
                    alt="Profile"                    
                  />
                </>
                <span className="fw-semibold">
                  {user.firstName} {user.lastName}
                </span>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to={`/profile/${user._id}`}>
                <FontAwesomeIcon className="mr-10" icon={faUser} />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logout}>
                <FontAwesomeIcon className="mr-10"
                  icon={faSignOutAlt}                  
                />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
