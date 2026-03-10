import { Router } from 'express';
import { createAccountSchema, updateAccountSchema } from '../schemas/account.schema.js';
import * as accountService from '../services/account.service.js';

const router = Router();

/**
 * @swagger
 * /accounts:
 *    post:
 *      summary: Créer un compte bancaire
 *      tags: [Accounts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Account'
 *      responses:
 *          201:
 *            description: Compte crée
 *          400:
 *              description: Validation échouée
 */
router.post('/', (req, res) => {
    try {
        const data = createAccountSchema.parse(req.body);
        const account = accountService.createAccount(data);
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
 * /accounts/user/{userId}:
 *   get:
 *     summary: Comptes d'un utilisateur
 *     description: Retourne la liste paginee des comptes d'un utilisateur
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste paginee des comptes
 */
router.get('/user/:userId', (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;

    const allAccounts = accountService.getAccountsByUser(parseInt(req.params.userId));
    const paginatedAccounts = allAccounts.slice(start, start + limit);

    res.json({
        data: paginatedAccounts,
        pagination: {
            page,
            limit,
            total: allAccounts.length,
            totalPages: Math.ceil(allAccounts.length / limit)
        }
    });
});

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Recuperer un compte par ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Compte trouve
 *       404:
 *         description: Non trouve
 */
router.get('/:id', (req, res) => {
    try {
        const account = accountService.getAccountById(parseInt(req.params.id));
        res.json(account);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /accounts/{id}:
 *   put:
 *     summary: Mettre a jour un compte
 *     tags: [Accounts]
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
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       200:
 *         description: Mis a jour
 *       400:
 *         description: Validation echouee
 *       404:
 *         description: Non trouve
 */
router.put('/:id', (req, res) => {
    try{
        const data = updateAccountSchema.parse(req.body);
        const account = accountService.updateAccount(parseInt(req.params.id), data);
        res.json(account);
    } catch (err) {
        if(err.errors){
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Supprimer un compte
 *     tags: [Accounts]
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
        accountService.deleteAccount(parseInt(req.params.id));
        res.status(204).send();
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /accounts/{id}/balance:
 *   patch:
 *     summary: Modifier le solde
 *     description: Crediter (montant positif) ou debiter (montant negatif) un compte
 *     tags: [Accounts]
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
 *             $ref: '#/components/schemas/BalanceUpdate'
 *     responses:
 *       200:
 *         description: Solde mis a jour
 *       404:
 *         description: Compte non trouve
 */
router.patch('/:id/balance', (req, res) => {
    try{
        const { amount } = req.body;
        const account = accountService.updateBalance(parseInt(req.params.id), amount);
        res.json(account);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;