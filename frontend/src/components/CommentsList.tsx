import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import commentService, { Comment as CommentType } from "../services/comment-service";
import Comment from "./Comment";
import EditComment from "./EditComment";

interface CommentsListProps {
  postId: string;
  show: boolean;
  onCommentChange: (change: number) => void;
  onClose: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId, show, onCommentChange, onClose }) => {
  const { user: loggedInUser } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [images, setImages] = useState<FileList | null>(null);
  const [currentComment, setCurrentComment] = useState<CommentType | null>(null);
 
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

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

  // Reset when userId changes
  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [postId]);
    
  // Infinite scrolling logic
  const handleScroll = () => {
    if (!modalBodyRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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

      // Clear the form after successful submission
      setNewComment("");
      setImages(null);

    } catch (error) {
      console.error("Failed to add comment", error);
      setError("Error adding comment. Please try again.");
    }
  };

  // Edit comment handlers
  const handleEditComment = (comment: CommentType) => {
    setCurrentComment(comment);        
  }; 
  
  const handleCommentUpdated = (updatedComment: CommentType) => {    
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
        await commentService.deleteComment(comment._id!);
        setComments((prevComments) => prevComments.filter((p) => p._id !== comment._id));
      } catch (error) {
        console.error("Failed to delete comment", error);
      }
    }
  };  

  // Reset editing when modal is closed
  const handleClose = () => {
    setCurrentComment(null);
    onClose(); 
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body
        ref={modalBodyRef}
        onScroll={handleScroll}
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        <div className="d-flex flex-column gap-3">
          {!isLoading && comments.length === 0 && <p>No comments yet.</p>}

          {/* Render EditComment if a comment is being edited */}
          {currentComment ? (
            <EditComment
              comment={currentComment}
              onCommentUpdated={handleCommentUpdated}
              onCancel={() => setCurrentComment(null)}
            />
          ) : (
            comments.map((comment) => {
              const isOwner = loggedInUser?._id === comment.sender;

              return (
                <div key={comment._id}>
                  <Comment
                    _id={comment._id}
                    postId={postId}
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
              );
            })
          )}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex align-items-center w-100">
          <Form.Control
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="me-2"
          />
          <Form.Group controlId="formImages" className="mt-3">
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setImages((e.target as HTMLInputElement).files)}
            />
            <Button
              variant="primary"
              onClick={() => handleAddComment(newComment, images ? Array.from(images) : [])}
            >
              Post
            </Button>
          </Form.Group>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsList;