import React, { useState, useEffect } from "react";
import commentService, { Comment as CommentType } from "../services/comment-service";
import CommentModal from "./CommentModal";

interface CommentsListProps {
  postId: string;
  show: boolean;
  onClose: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, show, onClose }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
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
  }, [postId, show]);

  // Add a new comment
  const handleAddComment = async (content: string, images: File[]) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postId", postId);
      images.forEach((image) => {
        formData.append("images", image);
      });

      const addedComment = await commentService.createComment(formData);
      setComments((prevComments) => [addedComment, ...prevComments]);
    } catch (error) {
      console.error("Failed to add comment", error);
      setError("Error adding comment. Please try again.");
    }
  };

  // Edit an existing comment
  const handleEditComment = async (commentId: string, updatedContent: string) => {
    try {
      const updatedComment = await commentService.updateComment(commentId, { content: updatedContent });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, content: updatedContent } : comment
        )
      );
    } catch (error) {
      console.error("Failed to edit comment", error);
      setError("Error editing comment. Please try again.");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
      setError("Error deleting comment. Please try again.");
    }
  };

  return (
    <CommentModal
      show={show}
      onClose={onClose}
      comments={comments}
      postId={postId}
      onAddComment={handleAddComment}
      onEditComment={handleEditComment}
      onDeleteComment={handleDeleteComment}
    />
  );
};

export default CommentsList;