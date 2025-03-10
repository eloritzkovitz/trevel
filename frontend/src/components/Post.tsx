import React, { useEffect, useState, useRef } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import ImageModal from "./ImageModal";
import CommentsList from "./CommentsList";

interface PostProps {
  title: string;
  content: string;
  senderName: string;
  senderImage: string;    
  images?: string[];
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void; 
}

const Post: React.FC<PostProps> = ({ title, content, senderName, senderImage, images, isOwner, onEdit, onDelete }) => {  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Handle image click
  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setShowImageModal(true);
  };

  // Handle close image modal
  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  // Handle previous image
  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // Handle next image
  const handleNextImage = () => {
    if (images) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center">
            <img src={senderImage} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
            <h5 className="card-text mb-0"><small className="text-muted">{senderName}</small></h5>
          </div>
          {isOwner && (
            <DropdownButton
              align="end"
              title={<FontAwesomeIcon icon={faEllipsisH} />}
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
        <h6 className="card-title">{title}</h6>
        <p className="card-text">{content}</p>
        {images && images.length > 0 && (
          <div className="d-flex flex-wrap">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                style={{ width: '120px', height: '120px', objectFit: 'cover', marginRight: '10px', cursor: 'pointer' }}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        )}
        <button className="btn btn-outline-primary btn-sm mt-2">Like ❤️</button>
        <button className="btn btn-outline-secondary btn-sm ms-2 mt-2">Comment 💬</button>
      </div>
      <ImageModal 
        show={showImageModal}
        title="Image"
        images={images || []}
        currentIndex={currentIndex}
        handleClose={handleCloseImageModal}
        handlePrev={handlePrevImage}
        handleNext={handleNextImage}
      />
    </div>
  );
};

export default Post;