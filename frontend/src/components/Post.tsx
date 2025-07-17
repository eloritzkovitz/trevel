import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faPencil,
  faTrash,
  faThumbsUp,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import ImageViewer from "./ImageViewer";
import CommentsList from "./CommentsList";
import { useAuth } from "../context/AuthContext";
import postService from "../services/post-service";
import { formatElapsedTime } from "../utils/date";
import { getImageUrl } from "../utils/imageUrl";
import "../styles/Post.css";

interface PostProps {
  _id?: string;
  title: string;
  content: string;
  sender: string;
  senderName: string;
  senderImage: string;
  images?: string[];
  likes: string[];
  likesCount: number;
  comments?: Comment[];
  commentsCount: number;
  createdAt: string;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const Post: React.FC<PostProps> = ({
  _id,
  title,
  content,
  sender,
  senderName,
  senderImage,
  images,
  likes,
  likesCount,
  commentsCount,
  createdAt,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageViewer, setImageViewer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewer = { _id: useAuth().user?._id };
  const [isLiked, setIsLiked] = useState(likes.includes(viewer._id || ""));
  const [likeCount, setLikeCount] = useState(likesCount);
  const [currentCommentsCount, setCommentsCount] = useState(commentsCount);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showComments, setShowComments] = useState(false);

  // Toggle options dropdown
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle image click
  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setImageViewer(true);
  };

  // Handle like button click
  const handleLikeClick = async () => {
    try {
      if (!_id) {
        throw new Error("Post ID is required");
      }
      const updatedPost = await postService.likePost(_id, viewer?._id || "");
      setIsLiked(updatedPost.likes?.includes(viewer?._id || "") || false);
      setLikeCount(updatedPost.likesCount || 0);
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  // Open the comments panel
  const handleCommentsClick = async () => {
    setShowComments(true);
  };

  return (
    <div className="card mb-2 panel">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img
              className="profile-picture-4 rounded-circle mr-10"
              src={getImageUrl(senderImage, "profile")}
              alt="Profile"
            />
            <div>
              <h5 className="card-text mb-0">
                <Link
                  to={`/profile/${sender}`}
                  className="text-muted text-decoration-none"
                >
                  <small>{senderName}</small>
                </Link>
              </h5>
              <small className="text-muted">
                {formatElapsedTime(createdAt)}
              </small>
            </div>
          </div>

          {/* Dropdown menu */}
          {isOwner && (
            <DropdownButton
              className="post-options"
              align="end"
              title={
                <FontAwesomeIcon
                  className="post-options-btn"
                  icon={faEllipsisH}
                />
              }
              id="dropdown-menu-align-end"
              variant="link"
              onToggle={handleToggleDropdown}
              show={showDropdown}
            >
              <Dropdown.Item onClick={onEdit}>
                <FontAwesomeIcon icon={faPencil} className="me-2" />
                Edit Post
              </Dropdown.Item>
              <Dropdown.Item onClick={onDelete}>
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete Post
              </Dropdown.Item>
            </DropdownButton>
          )}
        </div>

        {/* Post content */}
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{content}</p>
        {images && images.length > 0 && (
          <div className="image-grid">
            {images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="image-grid-item"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={getImageUrl(image, "image")}
                  alt={`Post image ${index + 1}`}
                  className="image-grid-img"
                />
                {index === 2 && images.length > 3 && (
                  <div
                    className="image-grid-more"
                    onClick={() => handleImageClick(index)}
                  >
                    +{images.length - 3} more
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="d-flex justify-content-between mt-2 post-counter">
          <div>
            <FontAwesomeIcon icon={faThumbsUp} /> <span>{likeCount}</span>
          </div>
          <div>
            <span>{currentCommentsCount}</span>{" "}
            <FontAwesomeIcon icon={faComment} />
          </div>
        </div>
        <hr />

        {/* Lower buttons */}
        <button
          className={`btn post-btn ${
            isLiked ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={handleLikeClick}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="me-2" />{" "}
          {isLiked ? "Liked" : "Like"}
        </button>
        <button className="btn post-btn" onClick={handleCommentsClick}>
          <FontAwesomeIcon icon={faComment} className="me-2" /> Comment
        </button>
      </div>

      {/* Image viewer */}
      <ImageViewer
        show={showImageViewer}
        images={images ? images.map((img) => getImageUrl(img, "image")) : []}
        currentIndex={currentIndex}
        onClose={() => setImageViewer(false)}
      />

      {/* Comments */}
      <CommentsList
        show={showComments}
        postId={_id || ""}
        onCommentChange={(change: number) =>
          setCommentsCount((prev) => prev + change)
        }
        onClose={() => setShowComments(false)}
      />
    </div>
  );
};

export default Post;
