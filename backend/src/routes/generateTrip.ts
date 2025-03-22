import express from 'express';
import { Configuration, OpenAIApi } from 'openai'; 

const router = express.Router();

// Initialize OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is set in the .env file
});

const openai = new OpenAIApi(configuration); // Create an instance of OpenAIApi

// POST route to generate a trip
router.post('/generate-trip', async (req, res) => {
  const { prompt } = req.body;

  // Validate the input
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string.' });
  }

  try {
    // Call OpenAI API to generate a trip
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Plan a full trip schedule for: ${prompt}`,
      max_tokens: 500,
    });

    // Return the generated trip
    res.json({ result: completion.data.choices[0].text.trim() });
  } catch (error: any) {
    // Log the error and return a proper error response
    console.error('Error generating trip:', error.message || error);
    res.status(500).json({ error: 'Failed to generate trip. Please try again later.' });
  }
});

export default router;