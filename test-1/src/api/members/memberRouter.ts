import { Router } from 'express';
import { memberController } from './memberController';

export const memberRouter = Router();

/**
 * @openapi
 * /members:
 *   get:
 *     summary: Get all members with borrowed book counts
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   name:
 *                     type: string
 *                   borrowedBooksCount:
 *                     type: integer
 */
memberRouter.get('/', memberController.getAll);
