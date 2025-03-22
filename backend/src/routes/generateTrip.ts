import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { VertexAI } from '@google-cloud/vertexai';

dotenv.config();

const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const modelName = 'gemini-pro';

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!projectId || !location) {
  throw new Error('PROJECT_ID and LOCATION must be defined in .env');
}

const vertexAI = new VertexAI({ project: projectId, location: location });
const model = vertexAI.getGenerativeModel({ model: modelName });

const router: express.Router = express.Router();

router.use(cors());

router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ message: 'Prompt is required and must be a string.' });
    return;
  }

  console.log('Prompt:', prompt);

  try {
    const request = {
      contents: [{ role: 'user', parts: [{ text: `Plan a full trip schedule for: ${prompt}` }] }],
    };

    const result = await model.generateContent(request);
    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    if (text) {
      res.status(200).json({ trip: text.trim() });
    } else {
      console.error('No result returned from Gemini API.');
      res.status(500).json({ message: 'No trip generated. Please try again.' });
    }
  } catch (error: any) {
    console.error('Error generating trip:', error);

    let errorMessage = 'Failed to generate trip.';
    if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
      errorMessage = error.response.data.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      message: errorMessage,
      error: error,
    });
  }
});

export default router;