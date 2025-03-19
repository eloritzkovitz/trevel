import React, { useState, useEffect, useCallback, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import Comment from "./Comment";
import commentService, { Comment as CommentType } from "../services/comment-service";
import { useAuth } from "../context/AuthContext";

interface CommentsListProps {
  postId: string;
  show: boolean; 
  refresh: boolean;
  onClose: () => void;  
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, show, refresh, onClose }) => {
  const { user: loggedInUser } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>(""); // For the comment text
  const [uploadedImages, setUploadedImages] = useState<File[]>([]); // For the uploaded images
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments when the component loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const fetchedComments = await commentService.getCommentByPostId(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch comments", error);
        setError("Error fetching comments...");
      } finally {
        setIsLoading(false);
      }
    };

    if (show) fetchComments();
  }, [postId, show, refresh]);

  // Handle new comment submission
  const handleAddComment = async () => {
    if (!newComment.trim() && uploadedImages.length === 0) {
      alert("Please add some text or upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", newComment);
      formData.append("postId", postId);
      uploadedImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const addedComment = await commentService.addComment(formData);
      setComments((prevComments) => [addedComment, ...prevComments]);
      setNewComment("");
      setUploadedImages([]);
    } catch (error) {
      console.error("Failed to add comment", error);
      setError("Error adding comment...");
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length + uploadedImages.length > 6) {
        alert("You can upload up to 6 images.");
        return;
      }
      setUploadedImages((prevImages) => [...prevImages, ...fileArray]);
    }
  };

  // Remove an uploaded image
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="comments-modal">
      <div className="comments-modal-content">
        {/* Modal Header */}
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>

        {/* Add New Comment */}
        <Modal.Body>
          <div className="add-comment-section mb-4">
            <Form.Group controlId="newComment">
              <Form.Label>Add a Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="uploadImages" className="mt-3">
              <Form.Label>Upload Images (up to 6)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="uploaded-images mt-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="uploaded-image-preview">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded ${index + 1}`}
                      className="img-thumbnail"
                    />
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>

            <Button
              variant="primary"
              className="mt-3"
              onClick={handleAddComment}
              disabled={isLoading}
            >
              Add Comment
            </Button>
          </div>

          {/* Existing Comments */}
          <div className="comments-container">
            {isLoading && <div>Loading comments...</div>}
            {!isLoading && comments.length === 0 && <div>No comments yet</div>}
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                postId={comment.postId}
                _id={comment._id}
                content={comment.content}
                sender={comment.sender}
                senderName={comment.senderName || "Unknown"}
                senderImage={comment.senderImage || ""}
                images={comment.images}
                likes={comment.likes || []}
                likesCount={comment.likesCount || 0}
                createdAt={comment.createdAt || ""}
                isOwner={loggedInUser?._id === comment.sender}
                onEdit={(updatedContent) => {
                  setComments((prevComments) =>
                    prevComments.map((c) =>
                      c._id === comment._id ? { ...c, content: updatedContent } : c
                    )
                  );
                }}
                onDelete={() => {
                  setComments((prevComments) =>
                    prevComments.filter((c) => c._id !== comment._id)
                  );
                }}
              />
            ))}
          </div>
        </Modal.Body>

        {/* Modal Footer */}
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} /> Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default CommentsList;