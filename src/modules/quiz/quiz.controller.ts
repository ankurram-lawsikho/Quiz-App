import { Request, Response } from "express";
import * as quizService from "./quiz.service";
import { IQuizSubmission } from "../../types/quiz.types";

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     description: Retrieve all quizzes with their questions and answers. Data is cached in Redis for 1 hour.
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: List of all quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getQuizzes = async (req: Request, res: Response) => {
    const quizzes = await quizService.findQuizzes();
    res.json(quizzes);
};

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get a specific quiz
 *     description: Retrieve a specific quiz by ID with its questions and answers. Data is cached in Redis for 1 hour.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quiz ID
 *     responses:
 *       200:
 *         description: Quiz found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Quiz not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getQuiz = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const quiz = await quizService.findQuizById(id);
    if (!quiz) {
        return res.status(404).send("Quiz not found");
    }
    res.json(quiz);
};

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     description: Create a new quiz with questions and answers. This will invalidate the quizzes cache.
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The quiz title
 *                 example: "JavaScript Basics"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: The question text
 *                       example: "What is JavaScript?"
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: string
 *                             description: The answer text
 *                             example: "A programming language"
 *                           isCorrect:
 *                             type: boolean
 *                             description: Whether this answer is correct
 *                             example: true
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const postQuiz = async (req: Request, res: Response) => {
    const newQuiz = await quizService.createQuiz(req.body);
    res.status(201).json(newQuiz);
};

/**
 * @swagger
 * /api/quizzes/{id}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     description: Submit answers for a quiz and get the score
 *     tags: [Quiz Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizSubmission'
 *           example:
 *             answers:
 *               1: 1
 *               2: 3
 *     responses:
 *       200:
 *         description: Quiz submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuizResult'
 *           example:
 *             score: 1
 *             total: 2
 *       404:
 *         description: Quiz not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Quiz not found"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const postSubmission = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const submission: IQuizSubmission = req.body;
    const result = await quizService.submitQuiz(id, submission.answers);
    if (!result) {
        return res.status(404).send("Quiz not found");
    }
    res.json(result);
};

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     description: Delete a quiz by ID. This will invalidate the quiz cache.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The quiz ID
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Quiz not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteQuiz = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await quizService.deleteQuiz(id);
    if (!deleted) {
        return res.status(404).send("Quiz not found");
    }
    res.status(204).send();
};