import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

interface EditCommentProps {
  commentId: string;
  postId: string; // Additional prop for postId
  initialContent: string;
  onSave: (updatedContent: string) => void;
  onCancel: () => void;
}

const EditComment: React.FC<EditCommentProps> = ({ commentId, postId, initialContent, onSave, onCancel }) => {
  const [content, setContent] = useState<string>(initialContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Comment content cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      // Call the save function passed as a prop
      onSave(content);
    } catch (error) {
      console.error("Failed to save comment:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-comment">
      <Form.Group controlId="editCommentContent">
        <Form.Label>Edit Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSaving}
        />
      </Form.Group>
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditComment;