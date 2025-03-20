import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPencil, faTrash, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { formatElapsedTime } from "../utils/date";
// import "../styles/Comment.css";

interface CommentProps {
  postId: string;
  _id?: string;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isLiked, setIsLiked] = useState(likes.includes(useAuth().user?._id || ""));
  const [likeCount, setLikeCount] = useState(likesCount);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle like
  const handleLike = async () => {
    try {      
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  // Handle edit
  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    onEdit(editContent);
    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  // Toggle dropdown
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="card mb-2 panel">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img className="profile-picture-4 rounded-circle mr-10" src={senderImage} alt="Profile" />
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
                <Dropdown.Item onClick={handleEdit}>
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
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                className="form-control"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
              <div className="mt-2">
                <button className="btn btn-primary btn-sm me-2" onClick={handleSaveEdit}>
                  Save
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mb-1">{content}</p>
          )}
          
          <div className="d-flex align-items-center mt-2">
            <button 
              className={`btn btn-sm ${isLiked ? 'text-primary' : 'text-muted'}`} 
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
              <small>{likeCount > 0 ? likeCount : ''}</small>
            </button>
          </div>
        </div>
      </div>    
  );
};

export default Comment;