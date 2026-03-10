import { Router } from 'express';
import { createTransactionSchema } from '../schemas/transaction.schema.js';
import * as transactionService from '../services/transaction.service.js';

const router = Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Creer une transaction
 *     description: La transaction est publiee dans RabbitMQ pour traitement asynchrone
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction creee
 *       400:
 *         description: Validation echouee
 */
router.post('/', async (req, res) => {
    try{
        const data = createTransactionSchema.parse(req.body);
        const transaction = await transactionService.createTransaction(data);
        res.status(201).json(transaction);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json ({ error: err.message });
    }
});

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lister les transactions
 *     tags: [Transactions]
 *     parameters:
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
 *         description: Liste paginee
 */
router.get('/', async (req, res) => {
    const allTransactions = await transactionService.getAllTransactions(parseInt(req.query.page) || 1, parseInt(req.query.limit) || 10);
    res.json(allTransactions);
});

/**
 * @swagger
 * /transactions/account/{accountId}:
 *   get:
 *     summary: Transactions d'un compte
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transactions du compte
 */
router.get('/account/:accountId', async (req, res) => {
    const transactions = await transactionService.getTransactionsByAccount(parseInt(req.params.accountId));
    res.json(transactions);
});

export default router;