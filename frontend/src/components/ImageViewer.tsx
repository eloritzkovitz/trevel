import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ImageModalProps {
  show: boolean;
  title: string;
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, title, images, currentIndex, onClose }) => {  
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  // Image modal handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
  };

  const handleModalClose = () => {      
    onClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center position-relative">
        <img src={images[currentImageIndex] || ''} alt="Post" className="img-fluid" />
        {images.length > 1 && (
          <>
            <Button 
              variant="link" 
              onClick={handlePrevImage} 
              disabled={currentImageIndex === 0} 
              className="position-fixed top-50 start-0 translate-middle-y"
              style={{ fontSize: '4rem', color: 'black', textDecoration: 'none', left: '20px', zIndex: 1050 }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Button 
              variant="link" 
              onClick={handleNextImage} 
              disabled={currentImageIndex === images.length - 1} 
              className="position-fixed top-50 end-0 translate-middle-y"
              style={{ fontSize: '4rem', color: 'black', textDecoration: 'none', right: '20px', zIndex: 1050 }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;