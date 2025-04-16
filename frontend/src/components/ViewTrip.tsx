import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ViewTripModalProps {
  selectedTrip: { prompt: string; response: string } | null;
  onClose: () => void;
}

const ViewTripModal: React.FC<ViewTripModalProps> = ({ selectedTrip, onClose }) => {
  if (!selectedTrip) return null;

  return (
    <div className="trip-modal-overlay" role="dialog">
      <div className="trip-modal-dialog">
        <div className="trip-modal-content">
          <div className="trip-modal-header">
            <h5 className="trip-modal-title">Trip Details</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="trip-modal-body">
            <h6>Prompt:</h6>
            <p>{selectedTrip.prompt}</p>
            <h6>Response:</h6>
            <div className="p-3">
              <ReactMarkdown>{selectedTrip.response}</ReactMarkdown>
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default ViewTripModal;