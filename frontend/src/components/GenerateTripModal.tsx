import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface GenerateTripModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (prompt: string, response: string) => void;
  generateTrip: (prompt: string) => Promise<string>;
}

const GenerateTripModal: React.FC<GenerateTripModalProps> = ({ show, onClose, onSave, generateTrip }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateTrip = async () => {
    if (!prompt.trim()) {
      alert("Please enter a destination or trip details!");
      return;
    }

    setLoading(true);
    try {
      const generatedTrip = await generateTrip(prompt);
      setResponse(generatedTrip);
    } catch (error: any) {
      console.error('Error generating trip:', error);
      alert(error.message || "Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!response.trim()) {
      alert("No trip to save!");
      return;
    }
    onSave(prompt, response);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Generate a New Trip</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>       
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your destination or trip details..."
              rows={4}
            />
            {response && (
              <div className="mt-3">
                <h6>Generated Trip:</h6>
                <div className="card panel p-3">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={handleGenerateTrip}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
            {response && (
              <button className="btn btn-success" onClick={handleSaveTrip}>
                Save Trip
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTripModal;