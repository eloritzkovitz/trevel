import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/ImageViewer.css";

interface ImageViewerProps {
  show: boolean;  
  images: string[];
  currentIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ show, images, currentIndex, onClose }) => {  
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
      <Modal.Header closeButton /> 
      <Modal.Body className="text-center d-flex justify-content-center align-items-center">        
        <img src={images[currentImageIndex] || ''} alt="Post" className="img-fluid full-size-image" />
        {images.length > 1 && (
          <>
            <Button 
              variant="link" 
              onClick={handlePrevImage} 
              disabled={currentImageIndex === 0} 
              className="chevron-button chevron-left"              
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Button 
              variant="link" 
              onClick={handleNextImage} 
              disabled={currentImageIndex === images.length - 1} 
              className="chevron-button chevron-right"              
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ImageViewer;