import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, GenerateContentResult } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY must be defined in .env');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateTrip = async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

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