import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in environment variables
  })
);

router.post('/generate-trip', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Plan a full trip schedule for: ${prompt}`,
      max_tokens: 500,
    });

    res.json({ result: completion.data.choices[0].text });
  } catch (error) {
    console.error('Error generating trip:', error);
    res.status(500).send('Error generating trip');
  }
});

export default router;