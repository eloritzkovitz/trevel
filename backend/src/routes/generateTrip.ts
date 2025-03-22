import express from 'express';
import { Configuration, OpenAIApi } from 'openai'; 

const router = express.Router();

// Initialize OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, 
});

const openai = new OpenAIApi(configuration); 

// POST route to generate a trip
router.post('/generate-trip', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' }); 
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Plan a full trip schedule for: ${prompt}`,
      max_tokens: 500,
    });

    res.json({ result: completion.data.choices[0].text.trim() }); 
  } catch (error: any) {
    console.error('Error generating trip:', error.message || error);
    res.status(500).json({ error: 'Failed to generate trip' }); 
  }
});

export default router;