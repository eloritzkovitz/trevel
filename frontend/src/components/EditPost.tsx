import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const [existingImages, setExistingImages] = useState<string[]>(post.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  useEffect(() => {
    setTitle(post.title);
    setContent(post.content);
    setExistingImages(post.images || []);
    setDeletedImages([]);
    setNewImages([]);
  }, [post]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  // Remove existing image from the post
  const removeExistingImage = (image: string) => {
    setExistingImages(existingImages.filter((img) => img !== image));
    setDeletedImages([...deletedImages, image]); // Mark for deletion
  };

  // Remove new image that has not been uploaded yet
  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
  
      // Append existing images that should remain
      existingImages.forEach((img) => formData.append("existingImages", img));
  
      // Append deleted images (as JSON string)
      formData.append("deletedImages", JSON.stringify(deletedImages));
  
      // Append new images
      newImages.forEach((file) => formData.append("images", file));
  
      await postService.updatePost(post._id!, formData);
  
      // Update UI after successful update
      const updatedPost = {
        ...post,
        title,
        content,
        images: existingImages.concat(newImages.map((file) => URL.createObjectURL(file))), // Only for preview
      };
  
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
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* Display Existing Images with Remove Option */}
          <Form.Group className="mt-3">
            <Form.Label>Existing Images</Form.Label>
            <div className="d-flex flex-wrap">
              {existingImages.map((img, index) => (
                <div key={index} className="position-relative me-2">
                  <img src={img} alt="Post" className="img-thumbnail" style={{ width: 100, height: 100 }} />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger position-absolute top-0 end-0"
                    style={{ cursor: "pointer", background: "white", borderRadius: "50%" }}
                    onClick={() => removeExistingImage(img)}
                  />
                </div>
              ))}
            </div>
          </Form.Group>

          {/* Display Newly Added Images */}
          <Form.Group className="mt-3">
            <Form.Label>New Images</Form.Label>
            <div className="d-flex flex-wrap">
              {newImages.map((img, index) => (
                <div key={index} className="position-relative me-2">
                  <img src={URL.createObjectURL(img)} alt="New" className="img-thumbnail" style={{ width: 100, height: 100 }} />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger position-absolute top-0 end-0"
                    style={{ cursor: "pointer", background: "white", borderRadius: "50%" }}
                    onClick={() => removeNewImage(index)}
                  />
                </div>
              ))}
            </div>
            <Form.Control type="file" multiple onChange={handleImageChange} className="mt-2" />
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