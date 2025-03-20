import React, { useState, useEffect } from "react";
import commentService, { Comment as CommentType } from "../services/comment-service";
import CommentModal from "./CommentModal";

interface CommentsListProps {
  postId: string;
  show: boolean;
  onCommentChange: (change: number) => void;
  onClose: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, show, onCommentChange, onClose }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments when the component loads
  useEffect(() => {
      const fetchComments = async () => {
        if (isLoading) return;
    
        try {
          setIsLoading(true);
          const fetchedComments = await commentService.getCommentByPostId(postId);
    
          setComments((prevComments) => {
            const newComments = fetchedComments.filter(
              (comment) => !prevComments.some((p) => p._id === comment._id)
            );
            return [...prevComments, ...newComments].sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
            );
          });
    
          setHasMore(fetchedComments.length > 0);
        } catch (error) {
          console.error("Failed to fetch coimments", error);
          setError("Error fetching comments...");
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchComments();
    }, [page, postId]);

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       setIsLoading(true);
  //       const fetchedComments = await commentService.getCommentByPostId(postId);
  //       setComments(fetchedComments);
  //     } catch (error) {
  //       console.error("Failed to fetch comments", error);
  //       setError("Error fetching comments...");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (show) fetchComments();
  // }, [postId, show]);

  // Add a new comment
  const handleAddComment = async (content: string, images: File[]) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postId", postId);

      // Append each image to the FormData
      images.forEach((image) => {
        formData.append("images", image);
      });      

      const addedComment = await commentService.createComment(formData);
      setComments((prevComments) => [addedComment, ...prevComments]);
      onCommentChange(1);
    } catch (error) {
      console.error("Failed to add comment", error);
      setError("Error adding comment. Please try again.");
    }
  };

  // Edit an existing comment
  const handleEditComment = async (commentId: string, updatedContent: string) => {
    try {
      const formData = new FormData();
      formData.append("content", updatedContent);
      const updatedComment = await commentService.updateComment(commentId, formData);
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
      onCommentChange(-1);
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