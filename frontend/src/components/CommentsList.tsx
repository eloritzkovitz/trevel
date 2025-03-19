import React, { useEffect, useState, useRef, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Comment from "./Comment";
import commentService, { Comment as CommentType } from "../services/comment-service";
import { useAuth } from "../context/AuthContext";

interface CommentsListProps {
  postId: string;
  onToggle: ()=> void;
  show: boolean; 
  refresh: boolean;
  
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, onToggle, show, refresh }) => {
  const { user: loggedInUser } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch comments when page changes
  useEffect(() => {
    const fetchComments = async () => {
      if (!hasMore || isLoading) return;

      try {
        setIsLoading(true);
        const fetchedComments = await commentService.getCommentsByPostId(postId, page);

        setComments((prevComments) => {
          const newComments = fetchedComments.filter(
            (comment) => !prevComments.some((c) => c._id === comment._id)
          );
          return [...prevComments, ...newComments].sort(
            (a, b) =>
              new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
        });

        setHasMore(fetchedComments.length > 0);
      } catch (error) {
        console.error("Failed to fetch comments", error);
        setError("Error fetching comments...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [page, postId, refresh]);

  // Reset when postId changes
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [postId, refresh]);

  // Infinite scrolling observer
  const lastCommentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Edit comment handler
  const handleEditComment = async (commentId: string, updatedContent: string) => {
    try {
      const updatedComment = await commentService.updateComment(postId, commentId, { content: updatedContent });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  // Delete comment handler
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await commentService.deleteComment(postId, commentId);
        setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    }
  };

  if (isLoading && comments.length === 0) {
    return <div>Loading comments...</div>;
  }

  if (!isLoading && comments.length === 0) {
    return <div>No comments yet</div>;
  }

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="comments-modal">
    <div className="comments-modal-content">
      {/* Modal Header */}
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>

      {/* Modal Body (Scrollable) */}
      <Modal.Body className="comments-modal-body">
        <div className="comments-container">
          {comments.map((comment, index) => (
            <div key={comment._id}>
              <Comment
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
                isOwner={isOwner}
                onEdit={(updatedContent) => handleEditComment(comment._id, updatedContent)}
                onDelete={() => handleDeleteComment(comment._id)}
              />
            </div>
          ))}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </Modal.Body>

      {/* Modal Footer (Optional) */}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} /> Close
        </Button>
      </Modal.Footer>
    </div>
  </Modal>
    // <div className="d-flex flex-column gap-3">
    //   {comments.map((comment, index) => {
    //     const isOwner = loggedInUser?._id === comment.sender;

    //     return (
    //       <div ref={index === comments.length - 1 ? lastCommentRef : null} key={comment._id}>
    //         <Comment
    //           postId={comment.postId}
    //           _id={comment._id}
    //           content={comment.content}
    //           sender={comment.sender}
    //           senderName={comment.senderName || "Unknown"}
    //           senderImage={comment.senderImage || ""}
    //           images={comment.images}
    //           likes={comment.likes || []}
    //           likesCount={comment.likesCount || 0}
    //           createdAt={comment.createdAt || ""}
    //           isOwner={isOwner}
    //           onEdit={(updatedContent) => handleEditComment(comment._id, updatedContent)}
    //           onDelete={() => handleDeleteComment(comment._id)}
    //         />
    //       </div>
    //     );
    //   })}
    //   {error && <div className="alert alert-danger">{error}</div>}
    // </div>
  );
};

export default CommentsList;