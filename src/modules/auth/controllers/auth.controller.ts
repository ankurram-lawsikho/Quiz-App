import { Request, Response } from 'express';
import { loginUser, registerUser, getUserProfile } from '../services/auth.service';

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     security: []  # No auth required for login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        const result = await loginUser({ username, password });
        
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     security: []  # No auth required for registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        
        const user = await registerUser({ username, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const profile = await getUserProfile(userId);
        
        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
};
