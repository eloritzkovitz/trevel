import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import commentService, { Comment as CommentType } from "../services/comment-service";
import ImageEditor from "./ImageEditor";

interface EditCommentProps {
  comment: CommentType;
  onCommentUpdated: (comment: CommentType) => void;
  onCancel: () => void;
}

const EditComment: React.FC<EditCommentProps> = ({ comment, onCommentUpdated, onCancel }) => {  
  const [content, setContent] = useState(comment.content);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagesState, setImagesState] = useState({
    existingImages: comment.images || [],
    newImages: [] as File[],
    deletedImages: [] as string[],
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();      
      formData.append("content", content);
  
      // Append existing images that should remain
      imagesState.existingImages.forEach((img) => formData.append("existingImages", img));
    
      // Append deleted images (as JSON string)
      formData.append("deletedImages", JSON.stringify(imagesState.deletedImages));
    
      // Append new images
      imagesState.newImages.forEach((file) => formData.append("images", file));

      console.log(comment);

      await commentService.updateComment(comment._id!, formData);
    
      // Update UI after successful update
      const updatedComment = {
        ...comment,    
        content,
        images: imagesState.existingImages.concat(
          imagesState.newImages.map((file) => URL.createObjectURL(file))
        ),
      };
    
      onCommentUpdated(updatedComment);      
    } catch (error) {
      console.error("Failed to update post", error);
      setError("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-comment">
      <Form.Group controlId="editCommentContent">        
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}          
        />
      </Form.Group>

      {/* ImageEditor Component */}
      <ImageEditor
        initialExistingImages={imagesState.existingImages}
        initialNewImages={imagesState.newImages}
        onImagesUpdated={(updatedImages) => setImagesState(updatedImages)}
      />

      {/* Action buttons */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" type="submit" disabled={isLoading} onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}>
          {isLoading ? "Updating..." : "Save"}
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>       
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default EditComment;