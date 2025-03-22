import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('API key not configured properly.');
}

const router: express.Router = express.Router();

// Enable CORS for this route
router.use(cors());

// POST /trips - Generate a trip schedule
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  const { prompt } = req.body;  

  // Validate the prompt
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ message: 'Prompt is required and must be a string.' });
    return;
  }

  console.log('Prompt:', prompt);

  try {
    console.log('Making request to OpenAI API...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates trip itineraries.'
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
  
    console.log('OpenAI API Response:', response.data);
  
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      res.status(200).json({ trip: response.data.choices[0].message.content.trim() });
    } else {
      console.error('No choices returned from OpenAI API.');
      res.status(500).json({ message: 'No trip generated. Please try again.' });
    }
  } catch (error: any) {
    console.error('Error generating trip:', error.response?.data || error.message || error);
    res.status(500).json({
      message: 'Failed to generate trip.',
      error: error.response?.data || error.message || 'An unexpected error occurred.'
    });
  }
}
);

export default router;