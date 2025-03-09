import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import postService from "../services/post-service";

interface PostModalProps {
  show: boolean;
  handleClose: () => void;
  onPostCreated: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ show, handleClose, onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

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
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formContent" className="mt-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Post"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PostModal;