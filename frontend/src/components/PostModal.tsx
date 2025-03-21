import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import postService from "../services/post-service";
import ImageUpload from "./ImageUpload";

interface PostModalProps {
  show: boolean;
  handleClose: () => void;
  onPostCreated: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ show, handleClose, onPostCreated }) => {
  const { user: loggedInUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  // Reset form state when modal is shown
  useEffect(() => {
    if (show) {
      setTitle("");
      setContent("");
      setImages(null);
      setError(null);
    }
  }, [show]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      if (images) {        
        Array.from(images).forEach((image) => {
          formData.append("images", image);
        });
      }

      await postService.createPost(formData);
      onPostCreated();
      handleClose();
    } catch (error) {
      console.error("Failed to create post", error);
      setError("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-start gap-2">
          <img
            className="profile-picture-4 rounded-circle"
            src={loggedInUser?.profilePicture || ""}
            alt="Profile"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
          <Form className="flex-grow-1" onSubmit={handleSubmit}>
            {/* Title Input */}
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Content Input */}
            <Form.Group controlId="formContent" className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
            
            {/* Image Upload */}
            <ImageUpload
              onImagesSelected={(files) => setImages(Array.from(files))}
              resetTrigger={!images || images.length === 0}
            />
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PostModal;