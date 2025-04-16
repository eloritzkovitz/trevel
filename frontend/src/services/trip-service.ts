import apiClient from "./api-client";
import Cookies from "js-cookie";

// Generate a trip
export const generateTrip = async (prompt: string): Promise<string> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }
  const response = await apiClient.post(`/trips/generate`, { prompt }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data.trip;
};

// Save a trip
export const saveTrip = async (trip: { prompt: string; response: string }): Promise<void> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }
  await apiClient.post(`/trips`, trip, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Get saved trips
export const getSavedTrips = async (): Promise<{ id: string; prompt: string; response: string }[]> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }
  const response = await apiClient.get(`/trips`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Ensure the response matches the expected structure
  return response.data.map((trip: any) => ({
    id: trip._id,
    prompt: trip.prompt,
    response: trip.response,
  }));
};

// Delete a trip
export const deleteTrip = async (id: string): Promise<void> => {
  const token = Cookies.get("accessToken");
  if (!token) {
    throw new Error("No access token found.");
  }
  await apiClient.delete(`/trips/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export default {
  generateTrip,
  saveTrip,
  getSavedTrips,
  deleteTrip,
};