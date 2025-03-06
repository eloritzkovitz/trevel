import React from "react";
import { Modal } from "react-bootstrap";

interface ImageModalProps {
  show: boolean;
  title: string;
  imageUrl: string | null;
  handleClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, title, imageUrl, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img src={imageUrl || ''} alt="Profile" className="img-fluid" />
      </Modal.Body>
    </Modal>
  );
};

export default ImageModal;