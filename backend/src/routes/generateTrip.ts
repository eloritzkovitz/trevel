import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('API key not configured properly.');
}

const router: express.Router = express.Router();

// POST /trips - Generate a trip schedule
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ message: 'Prompt is required and must be a string.' });
    return; 
  }

  try {
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
      res.status(200).json({ trip: response.data.choices[0].message.content.trim() });
    } else {
      throw new Error('No trip generated.');
    }
  } catch (error: any) {
    console.error('Error generating trip:', error.message || error);
    res.status(500).json({ message: 'Failed to generate trip.' });
  }
});

export default router;