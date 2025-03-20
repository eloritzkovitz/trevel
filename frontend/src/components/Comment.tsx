import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPencil, faTrash, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import commentService, {Comment as CommentType } from "../services/comment-service";
import { formatElapsedTime } from "../utils/date";
// import "../styles/Comment.css";

interface CommentProps {
  postId: string;
  _id: string;
  content: string;
  sender: string;
  senderName: string;
  senderImage: string;
  images?: string[];
  likes: string[];
  likesCount: number;
  createdAt: string;
  isOwner: boolean;
  onEdit: (updatedContent: string) => void;
  onDelete: () => void;
}

const Comment: React.FC<CommentProps> = ({ postId, _id, content, sender, senderName, senderImage, images, likes, likesCount, createdAt, isOwner, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);  
  const viewer = { _id: useAuth().user?._id };  
  const [isLiked, setIsLiked] = useState(likes.includes(viewer._id || ""));
  const [likeCount, setLikeCount] = useState(likesCount);  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle options dropdown
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle like button click
  const handleLikeClick = async () => {
    try {
      if (!_id) {
        throw new Error("Comment ID is required");
      }
      const updatedComment = await commentService.likeComment(_id, viewer?._id || "");
      setIsLiked(updatedComment.likes?.includes(viewer?._id || "") || false);
      setLikeCount(updatedComment.likesCount || 0);
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  return (
    <div className="card mb-2 panel">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img
              className="profile-picture-4 rounded-circle mr-10"
              src={senderImage}
              alt="Profile"
            />
            <div>
              <h5 className="card-text mb-0">
                <Link to={`/profile/${sender}`} className="text-muted text-decoration-none">
                  <small>{senderName}</small>
                </Link>
              </h5>
              <small className="text-muted">{formatElapsedTime(createdAt)}</small>
            </div>
          </div>

          {/* Dropdown menu */}
          {isOwner && (
            <DropdownButton
              className="post-options"
              align="end"
              title={<FontAwesomeIcon className="post-options-btn" icon={faEllipsisH} />}
              id="dropdown-menu-align-end"
              variant="link"
              onToggle={handleToggleDropdown}
              show={showDropdown}
            >
              <Dropdown.Item onClick={() => onEdit(content)}>
                <FontAwesomeIcon icon={faPencil} className="me-2" />
                Edit Comment
              </Dropdown.Item>
              <Dropdown.Item onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete Comment
              </Dropdown.Item>
            </DropdownButton>
          )}
        </div>

        <div>
          <p className="mb-1">{content}</p>
          <div className="d-flex align-items-center mt-2">
            <button
              className={`btn btn-sm ${isLiked ? "text-primary" : "text-muted"}`}
              onClick={handleLikeClick}
            >
              <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
              <span>{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;