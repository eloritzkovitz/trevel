import apiClient from "./api-client";

// Generate a trip
export const generateTrip = async (prompt: string): Promise<string> => {
  try {    
    const response = await apiClient.post(`/trips`, { prompt });
    return response.data.trip;
  } catch (error: any) {
    console.error('Error generating trip:', error.message || error);
    throw new Error(error.response?.data?.message || 'Failed to generate trip.');
  }
};

export default generateTrip;