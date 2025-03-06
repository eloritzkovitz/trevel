import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const NavigationBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Trevel Logo" style={{ height: '50px', marginRight: '10px' }} />
          Trevel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              <FontAwesomeIcon icon={faHome} style={{ marginRight: '5px' }} />
              Home
            </Nav.Link>
            {user && (
              <NavDropdown
                title={
                  <>
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} 
                    />
                    {user.firstName} {user.lastName}
                  </>
                }
                id="navbarDropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to={`/profile/${user._id}`}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '5px' }} />
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }} />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;