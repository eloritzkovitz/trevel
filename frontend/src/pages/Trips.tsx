import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import PostsList from "../components/PostsList";
import PostModal from "../components/PostModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Trips: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleGenerateTrip = async () => {
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
    }
  };

  return (
    <div>
      <h1>Plan Your Trip</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your destination or trip details..."
      />
      <button onClick={handleGenerateTrip}>Generate Trip</button>
      <div>
        <h2>Generated Trip</h2>
        <p>{response}</p>
      </div>
      <div>
        <h2>Search History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Trips;