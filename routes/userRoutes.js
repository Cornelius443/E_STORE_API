const express = require('express')
const router = express.Router();
const usersController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJwt')
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109ca
 *                   username:
 *                     type: string
 *                     example: JohnDoe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *                   roles:
 *                      type: array
 *                      items:
 *                        type: string
 *                      example: ["customer"]
 */
router.get('/', verifyJWT, usersController.getAllUsers);


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: JaneDoe
 *               email:
 *                 type: string
 *                 example: janedoe@example.com
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60d0fe4f5311236168a109cb
 *                 username:
 *                   type: string
 *                   example: JaneDoe
 *                 email:
 *                   type: string
 *                   example: janedoe@example.com
 */
router.post('/', usersController.createNewUser);


/**
 * @swagger
 * /users/user:
 *   get:
 *     summary: Get the authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: JaneDoe
 *                     email:
 *                       type: string
 *                       example: janedoe@example.com
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["admin", "user"]
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User does not have permission
 */
router.get('/user', verifyJWT, usersController.getUser);


module.exports = router;