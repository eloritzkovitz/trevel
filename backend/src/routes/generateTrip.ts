import express from 'express';
import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('API key not configured properly.');
}

// POST route to generate a trip
router.post('/generateTrip', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  // Validate the input
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string.' });
  }

  try {
    // Call OpenAI API to generate a trip
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates trip schedules.'
          },
          {
            role: 'user',
            content: `Plan a full trip schedule for: ${prompt}`
          }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    // Check if a response was generated
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      res.json({ result: response.data.choices[0].message.content.trim() });
    } else {
      throw new Error('No trip generated.');
    }
  } catch (error: any) {
    // Log the error and return a proper error response
    console.error('Error generating trip:', error.message || error);
    res.status(500).json({ error: 'Failed to generate trip. Please try again later.' });
  }
});

export default router;