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
    <Modal show={show} onHide={handleModalClose} centered dialogClassName="image-viewer-dialog">
      <div className="image-viewer-content">
        <Modal.Header closeButton className="image-viewer-header" /> 
        <Modal.Body className="image-viewer-body text-center d-flex justify-content-center align-items-center">        
          <img src={images[currentImageIndex] || ''} alt="Post" className="img-fluid full-size-image" />
          {images.length > 1 && (
            <>
              <Button 
                variant="link" 
                onClick={handlePrevImage} 
                className={`image-viewer-chevron-button image-viewer-chevron-left ${currentImageIndex === 0 ? 'disabled' : ''}`}
                disabled={currentImageIndex === 0}              
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
              <Button 
                variant="link" 
                onClick={handleNextImage} 
                className={`image-viewer-chevron-button image-viewer-chevron-right ${currentImageIndex === images.length - 1 ? 'disabled' : ''}`}
                disabled={currentImageIndex === images.length - 1}              
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </Button>
            </>
          )}
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ImageViewer;