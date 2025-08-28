import { Request, Response } from "express";
import { findQuizzes, findQuizById, createQuiz, deleteQuiz , submitQuiz, updateQuizTitle } from "../services/quiz.service";

/**
 * @swagger
 * /api/v1/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
export const getQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await findQuizzes();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
};

/**
 * @swagger
 * /api/v1/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 example: "JavaScript Basics"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "What is JavaScript?"
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                           isCorrect:
 *                             type: boolean
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
export const postQuiz = async (req: Request, res: Response) => {
    try {
        const quiz = await createQuiz(req.body);
        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ error: "Failed to create quiz" });
    }
};

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   get:
 *     summary: Get a specific quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
export const getQuiz = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const quiz = await findQuizById(id);
        
        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }
        
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quiz" });
    }
};

/**
 * @swagger
 * /api/v1/quizzes/{id}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answers
 *             properties:
 *               answers:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *                 example: { "1": 1, "2": 3 }
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                 total:
 *                   type: number
 *       404:
 *         description: Quiz not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
export const postSubmission = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await submitQuiz(id, req.body.answers);
        
        if (!result) {
            return res.status(404).send("Quiz not found");
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to submit quiz" });
    }
};

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
export const deleteQuizById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deleted = await deleteQuiz(id);
        
        if (!deleted) {
            return res.status(404).send("Quiz not found");
        }
        
        res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete quiz" });
    }
};

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   put:
 *     summary: Update quiz title
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Quiz Title"
 *     responses:
 *       200:
 *         description: Quiz title updated successfully
 *       404:
 *         description: Quiz not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
export const updateQuizById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { title } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        
        const updated = await updateQuizTitle(id, title);
        
        if (!updated) {
            return res.status(404).send("Quiz not found");
        }
        
        res.json({ message: "Quiz title updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update quiz title" });
    }
};