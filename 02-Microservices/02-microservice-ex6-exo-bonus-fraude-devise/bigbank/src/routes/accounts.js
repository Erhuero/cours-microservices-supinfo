import { Router } from 'express';
import { createAccountSchema, updateAccountSchema } from '../schemas/account.schema.js';
import * as accountService from '../services/account.service.js';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /users/{userId}/accounts:
 *   post:
 *     summary: Creer un compte pour un utilisateur
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       201:
 *         description: Compte cree
 *       400:
 *         description: Validation echouee
 */
router.post('/', async (req, res) => {
    try {
        const data =  createAccountSchema.parse(req.body);
        const account = await accountService.createAccount(parseInt(req.params.userId), data);
        res.status(201).json(account);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{userId}/accounts:
 *   get:
 *     summary: Lister les comptes d'un utilisateur
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des comptes
 */
router.get('/', async (req, res) => {
    try{
        const accounts = await accountService.getAccountsByUser(parseInt(req.params.userId));
        res.json(accounts);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message});
    }
});

/**
 * @swagger
 * /users/{userId}/accounts/{id}:
 *   get:
 *     summary: Recuperer un compte specifique
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compte
 *       404:
 *         description: Non trouve
 */
router.get('/:id', async (req, res) => {
    try{
        const account = await accountService.getAccountById(parseInt(req.params.id));
        res.json(account);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{userId}/accounts/{id}:
 *   put:
 *     summary: Modifier un compte
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
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
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Modifie
 *       400:
 *         description: Validation echouee
 */
router.put('/:id', async (req, res) => {
    try {
        const data = updateAccountSchema.parse(req.body);
        const account = await accountService.updateAccount(
            parseInt(req.params.userId),
            parseInt(req.params.id),
            data
        );
        res.json(account);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /users/{userId}/accounts/{id}:
 *   delete:
 *     summary: Supprimer un compte
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Supprime
 */
router.delete('/:id', async (req, res) => {
    try{
        await accountService.deleteAccount(
            parseInt(req.params.userId),
            parseInt(req.params.id)
        );
        res.status(204).send();
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;