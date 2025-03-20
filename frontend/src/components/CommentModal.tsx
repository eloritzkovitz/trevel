import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Comment as CommentType } from "../services/comment-service";
import Comment from "./Comment"; 
import EditComment from "./EditComment";

interface CommentModalProps {
  show: boolean;
  onClose: () => void;
  comments: CommentType[];
  postId: string;
  onAddComment: (content: string, images: File[]) => void;
  onEditComment: (commentId: string, updatedContent: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  show,
  onClose,
  comments,
  postId,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const handleAddComment = async () => {
    if (!newComment.trim() && uploadedImages.length === 0) {
      alert("Please add some text or upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", newComment);
      formData.append("postId", postId);

      // Append each image to the FormData
      uploadedImages.forEach((image) => {
        formData.append("images", image); // Ensure the key matches the backend's expectation
      });

      // Debugging: Log the FormData content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Submitting comment...");
      await onAddComment(newComment, uploadedImages);
      console.log("Comment successfully added");

      // Clear the form and close the modal only after successful submission
      setNewComment("");
      setUploadedImages([]);
      onClose();
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to add comment. Please try again.");
    }
  };

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

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editingCommentId ? (
          <EditComment
            commentId={editingCommentId}
            postId={postId}
            initialContent={comments.find((c) => c._id === editingCommentId)?.content || ""}
            onSave={(updatedContent) => {
              onEditComment(editingCommentId, updatedContent);
              setEditingCommentId(null);
            }}
            onCancel={() => setEditingCommentId(null)}
          />
        ) : (
          <>
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
              <Form.Control type="file" multiple accept="image/*" onChange={handleImageUpload} />
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
                      onClick={() => setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={handleAddComment}>
              Add Comment
            </Button>
            <div className="comments-container mt-4">
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
                  isOwner={true} // Replace with actual ownership logic
                  onEdit={() => setEditingCommentId(comment._id)}
                  onDelete={() => onDeleteComment(comment._id)}
                />
              ))}
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default CommentModal;