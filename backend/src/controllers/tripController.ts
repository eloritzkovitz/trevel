import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';
import Trip from '../models/Trip';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY must be defined in .env');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Generate a trip
export const generateTrip = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;
  const ownerId = req.params.userId;

  if (!ownerId) {
    res.status(401).json({ message: 'Unauthorized. Please log in to generate a trip.' });
    return;
  }

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ message: 'Prompt is required and must be a string.' });
    return;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result: GenerateContentResult = await model.generateContent([`Plan a full trip schedule for: ${prompt}`]);

    if (result && result.response && result.response.text) {
      let trip: string = '';

      if (typeof result.response.text === 'function') {
        const textResult = result.response.text();
        if (typeof textResult === 'string') {
          trip = textResult.trim();
        }
      } else if (typeof result.response.text === 'string') {
        trip = (result.response.text as string).trim();
      }

      if (trip) {
        res.status(200).json({ trip });
      } else {
        throw new Error('Generated response was empty or not a valid string.');
      }
    } else {
      throw new Error('Failed to retrieve trip from the generated response.');
    }
  } catch (error: any) {
    console.error('Error generating trip:', error);

    let errorMessage = 'Failed to generate trip. An unexpected error occurred.';

    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = `API Error: ${error.response.data.error.message}`;
    } else if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
    }

    res.status(500).json({
      message: errorMessage,
      error,
    });
  }
};

// Save a trip
export const saveTrip = async (req: Request, res: Response): Promise<void> => {
  const { prompt, response } = req.body;
  const ownerId = req.params.userId;

  if (!prompt || !response) {
    res.status(400).json({ message: 'Prompt and response are required.' });
    return;
  }

  try {
    const trip = new Trip({ ownerId, prompt, response });
    await trip.save();
    res.status(201).json({ message: 'Trip saved successfully.', trip });
  } catch (error: any) {
    console.error('Error saving trip:', error);
    res.status(500).json({ message: 'Failed to save trip. An unexpected error occurred.' });
  }
};

// Get all trips for the authenticated user
export const getTrips = async (req: Request, res: Response): Promise<void> => {
  const ownerId = req.params.userId;

  try {
    const trips = await Trip.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error: any) {
    console.error('Error retrieving trips:', error);
    res.status(500).json({ message: 'Failed to retrieve trips. An unexpected error occurred.' });
  }
};

// Delete a trip
export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const ownerId = req.params.userId;

  try {
    const trip = await Trip.findOneAndDelete({ _id: id, ownerId });

    if (!trip) {
      res.status(404).json({ message: 'Trip not found.' });
      return;
    }

    res.status(200).json({ message: 'Trip deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Failed to delete trip. An unexpected error occurred.' });
  }
};