import React from "react";
import { Modal } from "react-bootstrap";

interface ImageModalProps {
  show: boolean;
  imageUrl: string | null;
  handleClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, imageUrl, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img src={imageUrl || ''} alt="Profile" className="img-fluid" />
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;