import { Router } from 'express';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';
import * as userService from '../services/user.service.js';

const router = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creer un utilisateur
 *     description: Cree un utilisateur avec hashage bcrypt du mot de passe et validation Zod
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur cree
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation echouee
 */
router.post('/', async (req, res) => {
    try {
        const data = createUserSchema.parse(req.body);
        const user = await userService.createUser(data);
        res.status(201).json(user);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lister les utilisateurs
 *     description: Retourne la liste paginee. Filtrage par role possible.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numero de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elements par page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [client, employee, admin]
 *         description: Filtrer par role
 *     responses:
 *       200:
 *         description: Liste paginee des utilisateurs
 */
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role || null;
    const start = (page - 1) * limit;

    const allUsers = userService.getAllUsers(role);
    const paginatedUsers = allUsers.slice(start, start + limit);

    res.json({
        data: paginatedUsers,
        pagination: {
            page,
            limit,
            total: allUsers.length,
            totalPages: Math.ceil(allUsers.length / limit)
        }
    });
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Recuperer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouve
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Non trouve
 */
router.get('/:id', (req, res) => {
    try {
        const user = userService.getUserById(parseInt(req.params.id));
        res.json(user);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre a jour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Mis a jour
 *       400:
 *         description: Validation echouee
 *       404:
 *         description: Non trouve
 */
router.put('/:id', async (req, res) => {
    try {
        const data = updateUserSchema.parse(req.body);
        const user = await userService.updateUser(parseInt(req.params.id), data);
        res.json(user);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprime
 *       404:
 *         description: Non trouve
 */
router.delete('/:id', (req, res) => {
    try{
        userService.deleteUser(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;