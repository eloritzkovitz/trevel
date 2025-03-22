import React, { useState } from 'react';
import './Trips.css'; // Import the CSS file for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faHistory } from "@fortawesome/free-solid-svg-icons";

const Trips: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to handle AI trip generation
  const handleGenerateTrip = async () => {
    if (!prompt.trim()) return alert("Please enter a destination or trip details!");

    setLoading(true);
    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.result);
      setHistory((prev) => [...prev, prompt]);
    } catch (error) {
      console.error('Error generating trip:', error);
      alert("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trips-container">
      <h1 className="trips-title">
        <FontAwesomeIcon icon={faPlane} /> Plan Your Trip
      </h1>
      <div className="trips-content">
        {/* Input for trip prompt */}
        <textarea
          className="trips-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your destination or trip details..."
        />
        <button
          className="trips-generate-button"
          onClick={handleGenerateTrip}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Trip"}
        </button>

        {/* Display generated trip */}
        {response && (
          <div className="trips-response">
            <h2 className="trips-section-title">Generated Trip</h2>
            <p className="trips-response-text">{response}</p>
          </div>
        )}

        {/* Display search history */}
        {history.length > 0 && (
          <div className="trips-history">
            <h2 className="trips-section-title">
              <FontAwesomeIcon icon={faHistory} /> Search History
            </h2>
            <ul className="trips-history-list">
              {history.map((item, index) => (
                <li key={index} className="trips-history-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;