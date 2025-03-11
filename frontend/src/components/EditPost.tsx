import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import postService, { Post as PostType } from "../services/post-service";

interface EditPostProps {
  show: boolean;
  handleClose: () => void;
  post: PostType;
  onPostUpdated: (post: PostType) => void;
}

const EditPost: React.FC<EditPostProps> = ({ show, handleClose, post, onPostUpdated }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      await postService.updatePost(post._id!, formData); // Update post in database
      const updatedPost = { ...post, title, content }; // Update post in parent component
      onPostUpdated(updatedPost);
      handleClose();
    } catch (error) {
      console.error("Failed to update post", error);
      setError("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
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
            {isLoading ? "Updating..." : "Update Post"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPost;