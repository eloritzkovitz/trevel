import React, { useState, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import userService, { User } from "../services/user-service";
import { useAuth } from "../context/AuthContext";

const EditProfile: React.FC<{ show: boolean; handleClose: () => void; onUpdate: (user: User) => void }> = ({ show, handleClose, onUpdate }) => {
  const { user: loggedInUser, setUser: setLoggedInUser } = useAuth();
  const [firstName, setFirstName] = useState(loggedInUser?.firstName || "");
  const [lastName, setLastName] = useState(loggedInUser?.lastName || "");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [headline, setHeadline] = useState(loggedInUser?.headline || "");
  const [bio, setBio] = useState(loggedInUser?.bio || "");
  const [location, setLocation] = useState(loggedInUser?.location || ""); 
  const [website, setWebsite] = useState(loggedInUser?.website || ""); 
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusType, setStatusType] = useState<"success" | "danger" | null>(null);
  const navigate = useNavigate();  

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Handle clear profile picture
  const handleClearProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("headline", headline.trim());
    formData.append("bio", bio.trim());
    formData.append("location", location.trim()); 
    formData.append("website", website.trim());   
    if (password) {
      formData.append("password", password);
    }
    if (profilePicture !== null) {
      formData.append("profilePicture", profilePicture);
    } else {
      formData.append("profilePicture", "");
    }

    try {
      const updatedUser = await userService.updateUser(loggedInUser!._id!, formData);
      setLoggedInUser(updatedUser);
      onUpdate(updatedUser);
      setStatusMessage("Profile updated successfully!");
      setStatusType("success");
      setTimeout(() => {
        setStatusMessage(null);
        handleClose();
        navigate(`/profile/${loggedInUser!._id}`);
      }, 2000);
    } catch (error) {
      setStatusMessage("Failed to update profile.");
      setStatusType("danger");
      console.error("Failed to update profile", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Headline</Form.Label>
            <Form.Control
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" onChange={handleProfilePictureChange} ref={fileInputRef} />            
            <Button variant="danger" onClick={handleClearProfilePicture} className="ms-2">
            Clear
            </Button>
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>          
        </Form>
        {statusMessage && statusType && (
          <Alert variant={statusType} className="mt-3">
            {statusMessage}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditProfile;