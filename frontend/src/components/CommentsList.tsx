import React, { useEffect, useState, useRef, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes} from "@fortawesome/free-solid-svg-icons";
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
        const fetchedComments = await commentService.getCommentByPostId(postId);

        setComments((prevComments) => {
            const newComments: CommentType[] = fetchedComments.filter(
            (comment: CommentType) => !prevComments.some((c: CommentType) => c._id === comment._id)
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
 const handleEditComment = (comment: CommentType) => {
     setCurrentComment(comment);
     setShowEditModal(true);    
   };
 
   const handleCloseEditModal = () => {
     setShowEditModal(false);
     setCurrentComment(null);
   };
 
   const handleCommentUpdated = (updatedComment: CommentType) => {
     setShowEditModal(false);
     setCurrentComment(null);    
     setComments((prevComments) =>
       prevComments.map((comment) =>
         comment._id === updatedComment._id ? updatedComment : comment
       )
     );
   };
 

  // Delete comment handler
  const handleDeleteComment = async (comment: CommentType) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await commentService.deleteComment(postId, comment._id!);
        setComments((prevComments) => prevComments.filter((c) => c._id !== comment._id?));
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    }
  };

  // if (isLoading && comments.length === 0) {
  //   return <div>Loading comments...</div>;
  // }

  // if (!isLoading && comments.length === 0) {
  //   return <div>No comments yet</div>;
  // }
  
  return (
    <Modal show={show} onHide={onClose} centered dialogClassName="comments-modal">
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
                onEdit={() => handleEditComment(comment)}
                onDelete={() => handleDeleteComment(comment)}
              />
            </div>
          ))}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </Modal.Body>

      {/* Modal Footer (Optional) */}
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