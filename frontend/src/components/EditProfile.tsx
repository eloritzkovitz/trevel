import React, { useState } from "react";
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
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "danger" | null>(null);
  const navigate = useNavigate();

  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (password) {
      formData.append("password", password);
    }
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control type="file" onChange={handleProfilePictureChange} />
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