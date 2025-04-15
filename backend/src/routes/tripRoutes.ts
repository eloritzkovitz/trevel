import express from 'express';
const router = express.Router();
import { generateTrip } from '../controllers/tripController';

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: API for generating trip schedules
 */

/**
 * @swagger
 * /api/trips/generate:
 *   post:
 *     summary: Generate a trip schedule
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: A description of the trip to generate (e.g., destination, duration, preferences).
 *                 example: "A 5-day trip to Paris with a focus on art and cuisine"
 *     responses:
 *       200:
 *         description: Successfully generated a trip schedule
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trip:
 *                   type: string
 *                   description: The generated trip schedule
 *                   example: "Day 1: Visit the Louvre Museum..."
 *       400:
 *         description: Invalid input (e.g., missing or invalid prompt)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Prompt is required and must be a string."
 *       500:
 *         description: Server error or API failure
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to generate trip. An unexpected error occurred."
 */
router.post('/generate', generateTrip);

export default router;