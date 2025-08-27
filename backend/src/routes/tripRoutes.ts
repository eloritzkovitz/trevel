import express from 'express';
const router = express.Router();
import { generateTrip, saveTrip, getTrips, deleteTrip } from '../controllers/tripController';
import { authenticate } from "@eloritzkovitz/server-essentials";

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
 *     security:
 *       - bearerAuth: []  # Indicates that this route requires authentication
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
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please log in to generate a trip."
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
router.post('/generate', authenticate, generateTrip);

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Save a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []  # Indicates that this route requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The input prompt used to generate the trip.
 *                 example: "A 5-day trip to Paris with a focus on art and cuisine"
 *               response:
 *                 type: string
 *                 description: The generated trip details.
 *                 example: "Day 1: Visit the Louvre Museum..."
 *     responses:
 *       201:
 *         description: Successfully saved the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip saved successfully."
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid trip data."
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please log in to save a trip."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to save trip. An unexpected error occurred."
 */
router.post('/', authenticate, saveTrip);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Retrieve all saved trips for the authenticated user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []  # Indicates that this route requires authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the trip.
 *                   prompt:
 *                     type: string
 *                     description: The input prompt used to generate the trip.
 *                   response:
 *                     type: string
 *                     description: The generated trip details.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time the trip was created.
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please log in to view your trips."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve trips. An unexpected error occurred."
 */
router.get('/', authenticate, getTrips);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a saved trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []  # Indicates that this route requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip deleted successfully."
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized. Please log in to delete a trip."
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete trip. An unexpected error occurred."
 */
router.delete('/:id', authenticate, deleteTrip);

export default router;