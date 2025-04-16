import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faHistory } from "@fortawesome/free-solid-svg-icons";
import { generateTrip } from '../services/ai-service';
import Navbar from '../components/Navbar';

const Trips: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to handle AI trip generation
  const handleGenerateTrip = async () => {
    if (!prompt.trim()) {
      alert("Please enter a destination or trip details!");
      return;
    }

    setLoading(true);
    try {
      const generatedTrip = await generateTrip(prompt);
      setResponse(generatedTrip);
      setHistory((prev) => [...prev, prompt]);
    } catch (error: any) {
      console.error('Error generating trip:', error);
      alert(error.message || "Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          {/* Trips Section */}
          <div className="col-md-8">
            <div className="trips-container p-4">
              <h1 className="text-center mb-4">
                <FontAwesomeIcon icon={faPlane} className="me-2" />
                Plan Your Itinerary
              </h1>

              <div className="trips-content card panel p-4 shadow-sm">
                {/* Input for trip prompt */}
                <div className="mb-3">
                  <textarea
                    className="form-control trips-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your destination or trip details..."
                    rows={4}
                  />
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary trips-generate-button"
                    onClick={handleGenerateTrip}
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Generating...
                      </span>
                    ) : (
                      "Generate Trip"
                    )}
                  </button>
                </div>

                {/* Display generated trip */}
                {response && (
                  <div className="trips-response mt-4">
                    <div className="card panel p-3">
                      <h2 className="trips-section-title text-primary">Generated Trip</h2>
                      {/* Render Markdown response */}
                      <div className="trips-response-text">
                        <ReactMarkdown>{response}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Display search history */}
                {history.length > 0 && (
                  <div className="trips-history mt-4">
                    <div className="card panel p-3">
                      <h2 className="trips-section-title text-secondary">
                        <FontAwesomeIcon icon={faHistory} className="me-2" />
                        Search History
                      </h2>
                      <ul className="list-group trips-history-list">
                        {history.map((item, index) => (
                          <li key={index} className="list-group-item trips-history-item">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;