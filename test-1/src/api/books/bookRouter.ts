import { Router } from 'express';
import { bookController } from './bookController';

export const bookRouter = Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books with available quantities
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   available:
 *                     type: integer
 */
bookRouter.get('/', bookController.getAll);
