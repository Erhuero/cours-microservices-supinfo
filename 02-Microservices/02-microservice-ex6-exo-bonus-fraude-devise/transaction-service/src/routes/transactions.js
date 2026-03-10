import { Router } from 'express';
import { createTransactionSchema } from '../schemas/transaction.schema.js';
import * as transactionService from '../services/transaction.service.js';

const router = Router();
/**
 *@swagger
 * /transactions:
 *  post:
 *      summary: Créer une transaction
 *      description: Transfer de l'argent entre deux comptes
 *      tags: [Transactions]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Transaction'
 *      responses:
 *          201:
 *              description: Transaction cree
 *          400:
 *              description: Validation echouée
 */
router.post('/', async (req, res) => {
    try {
        const data =  createTransactionSchema.parse(req.body);

        const userId = parseInt(req.headers['x-user-id']);
        const userRole = req.headers['x-user-role'] || 'client';

        const transaction = await transactionService.createTransaction(data, userId, userRole);
        res.status(201).json(transaction);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
})

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lister les transactions
 *     description: Retourne la liste paginee des transactions
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
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const start = (page - 1) * limit;

    const allTransactions = transactionService.getAllTransactions();
    const paginated = allTransactions.slice(start, start + limit);

    res.json({
        data: paginated,
        pagination: {
            page, limit,
            total: allTransactions.length,
            totalPages: Math.ceil(allTransactions.length / limit)
        }
    });
});

/**
 * @swagger
 * /transactions/account/{accountId}:
 *   get:
 *     summary: Transactions d'un compte
 *     description: Retourne toutes les transactions liees a un compte
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des transactions du compte
 */
router.get('/account/:accountId', (req, res) => {
    const transactions = transactionService.getTransactionsByAccount(
        parseInt(req.params.accountId)
    );
    res.json(transactions);
});

export default router;

