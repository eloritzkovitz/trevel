import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { generateTrip, saveTrip, getSavedTrips, deleteTrip } from '../services/trip-service';
import Navbar from '../components/Navbar';
import GenerateTripModal from '../components/GenerateTripModal';
import ViewTripModal from '../components/ViewTrip';
import '../styles/Trips.css';

const Trips: React.FC = () => {
  const [savedTrips, setSavedTrips] = useState<{ id: string; prompt: string; response: string }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<{ prompt: string; response: string } | null>(null);

  // Fetch saved trips on component mount
  useEffect(() => {
    const fetchSavedTrips = async () => {
      try {
        const trips = await getSavedTrips();
        setSavedTrips(trips);
      } catch (error) {
        console.error('Error fetching saved trips:', error);
      }
    };

    fetchSavedTrips();
  }, []);

  // Handle trip deletion
  const handleDeleteTrip = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) {
      return;
    }

    try {
      await deleteTrip(id);
      setSavedTrips((prev) => prev.filter((trip) => trip.id !== id));
      alert("Trip deleted successfully!");
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert("Failed to delete trip. Please try again.");
    }
  };

  // Handle trip saving
  const handleSaveTrip = async (prompt: string, response: string) => {
    try {
      await saveTrip({ prompt, response });
      setSavedTrips((prev) => [...prev, { id: Date.now().toString(), prompt, response }]);
      alert("Trip saved successfully!");
    } catch (error) {
      console.error('Error saving trip:', error);
      alert("Failed to save trip. Please try again.");
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          {/* Saved Trips Section */}
          <div className="col-md-8">
            <div className="trips-container p-4">
              <h1 className="text-center mb-4">
                <FontAwesomeIcon icon={faPlane} className="me-2" />
                My Saved Trips
              </h1>

              {/* Display saved trips */}
              {savedTrips.length > 0 ? (
                <div className="trips-saved mt-4">
                  <div className="">
                    <ul className="list-group trips-saved-list">
                      {savedTrips.map((trip) => (
                        <li
                          key={trip.id}
                          className="list-group-item trips-saved-item d-flex justify-content-between align-items-center"
                        >
                          <span
                            className="trip-prompt"
                            onClick={() => setSelectedTrip({ prompt: trip.prompt, response: trip.response })}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {trip.prompt}
                          </span>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteTrip(trip.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted">No saved trips yet. Click the "+" button to generate a new trip!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="btn btn-primary fab"
        onClick={() => setShowModal(true)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {/* Modal for Generating a New Trip */}
      <GenerateTripModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTrip}
        generateTrip={generateTrip}
      />

      {/* Modal for Viewing Trip Details */}
      <ViewTripModal
        selectedTrip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  );
};

export default Trips;