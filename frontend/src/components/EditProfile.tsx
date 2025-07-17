import React, { useState, useRef } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import userService, { User } from "../services/user-service";
import { getImageUrl } from "../utils/imageUrl";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMAGE = "/images/default-profile.png";

const EditProfile: React.FC<{
  show: boolean;
  handleClose: () => void;
  onProfileUpdated: (user: User) => void;
}> = ({ show, handleClose, onProfileUpdated }) => {
  const { user: loggedInUser, setUser: setLoggedInUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for form data
  const [formData, setFormData] = useState({
    firstName: loggedInUser?.firstName || "",
    lastName: loggedInUser?.lastName || "",
    password: "",
    headline: loggedInUser?.headline || "",
    bio: loggedInUser?.bio || "",
    location: loggedInUser?.location || "",
    website: loggedInUser?.website || "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(
    loggedInUser?.profilePicture || DEFAULT_IMAGE
  );
  const [status, setStatus] = useState<{
    message: string;
    type: "success" | "danger";
  } | null>(null);

  // Derived Profile Picture URL
  const displayProfilePicture = profilePicture
    ? URL.createObjectURL(profilePicture)
    : getImageUrl(currentProfilePicture, "profile");

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Profile Picture Change
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  // Remove Profile Picture
  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setCurrentProfilePicture(DEFAULT_IMAGE); // Reset to default image
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) submissionData.append(key, value.trim());
    });

    if (profilePicture) {
      submissionData.append("profilePicture", profilePicture); // Append new profile picture
    } else if (currentProfilePicture === DEFAULT_IMAGE) {
      submissionData.append("profilePicture", ""); // Indicate removal
    }

    try {
      const updatedUser = await userService.updateUser(
        loggedInUser!._id!,
        submissionData
      );
      setLoggedInUser(updatedUser);
      onProfileUpdated(updatedUser);
      setStatus({ message: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        setStatus(null);
        handleClose();
        navigate(`/profile/${updatedUser._id}`);
      }, 2000);
    } catch (error) {
      setStatus({ message: "Failed to update profile.", type: "danger" });
      console.error("Profile update error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <Form.Group className="mb-3" key={key}>
              <Form.Label>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Form.Label>
              {key === "bio" ? (
                <Form.Control
                  as="textarea"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  rows={3}
                />
              ) : (
                <Form.Control
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              )}
            </Form.Group>
          ))}

          {/* Profile Picture */}
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            {(profilePicture ||
              loggedInUser?.profilePicture !== DEFAULT_IMAGE) && (
              <div className="mb-2">
                <div className="position-relative d-inline-block">
                  <img
                    src={displayProfilePicture}
                    alt="Profile"
                    className="img-thumbnail d-block"
                    style={{ width: 100, height: 100 }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger position-absolute"
                    style={{
                      top: "0px",
                      right: "0px",
                      cursor: "pointer",
                      background: "white",
                      borderRadius: "50%",
                    }}
                    onClick={handleRemoveProfilePicture}
                  />
                </div>
              </div>
            )}
            <Form.Control
              type="file"
              onChange={handleProfilePictureChange}
              ref={fileInputRef}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>

        {status && (
          <Alert variant={status.type} className="mt-3">
            {status.message}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditProfile;
