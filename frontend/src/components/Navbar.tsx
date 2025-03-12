import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, InputGroup} from "react-bootstrap";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHome, faPlane, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const NavigationBar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar
      bg="white"
      variant="light"
      expand="lg"
      fixed="top"
      style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)" }}
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" className="ms-3">
          <img src={logo} alt="Trevel Logo" style={{ height: "50px" }} />
        </Navbar.Brand>

        {/* Search */}
        <Form
          className="d-flex ms-auto position-relative"
          style={{ height: "60px", width: "450px" }}
        >
          <InputGroup>
            <FontAwesomeIcon
              icon={faSearch}
              className="position-absolute text-muted"
              style={{ height: "20px", left: "15px", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}
            />
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2 rounded-pill ps-5"
              aria-label="Search"
              style={{ fontSize: "24px", backgroundColor: "#f8f9fa", borderColor: "#f8f9fa", boxShadow: "inset 1px 1px 1px rgba(0, 0, 0, 0.03)",
              }}
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
              className={`nav-link d-flex flex-column align-items-center ${location.pathname === "/" ? "active text-primary" : ""}`}
              style={{ marginRight: "15px" }}
            >
              <FontAwesomeIcon icon={faHome} style={{ height: "25px" }} />
              <span>Home</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/trips"
              className={`nav-link d-flex flex-column align-items-center ${location.pathname === "/trips" ? "active text-primary" : ""}`}
              style={{ marginRight: "15px" }}
            >
              <FontAwesomeIcon icon={faPlane} style={{ height: "25px" }} />
              <span>Trips</span>
            </Nav.Link>
          </Nav>

          {/* Profile Dropdown */}
          {user && (
            <NavDropdown
              title={
                <>
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    style={{ height: "50px", width: "50px",  borderRadius: "50%" }}
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
                    src={user.profilePicture}
                    alt="Profile"
                    style={{ height: "50px", width: "50px",  borderRadius: "50%", marginRight: "10px" }}
                  />
                </>
                <span className="fw-semibold">
                  {user.firstName} {user.lastName}
                </span>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to={`/profile/${user._id}`}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: "5px" }} />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logout}>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{ marginRight: "5px" }}
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
