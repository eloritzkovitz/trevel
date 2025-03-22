import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('API key not configured properly.');
}

// Generate a trip schedule using the OpenAI API
const generateTrip = async (prompt: string): Promise<void> => {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt is required and must be a string.');
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
          console.log(response.data.choices[0].message.content.trim());
        } else {
          throw new Error('No trip generated.');
        }
      } catch (error: any) {
        console.error('Error generating trip:', error.message || error);
        throw new Error('Failed to generate trip.');
      }
    };
    
    export { generateTrip };