const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController')


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication API
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     description: Authenticates a user and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 foundUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109cb
 *                     username:
 *                       type: string
 *                       example: JohnDoe
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Customer"]
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post('/', authController.login)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Generates a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *     responses:
 *       200:
 *         description: Successfully refreshed token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 *       403:
 *         description: Forbidden - Refresh token verification failed
 */
router.post('/refresh', authController.refresh);
module.exports = router;