import { Router } from 'express';
import { createTransactionSchema } from '../schemas/transaction.schema.js';
import * as transactionService from '../services/transaction.service.js';

const router = Router();

router.post('/', (req, res) => {
    try{
        const data = createTransactionSchema.parse(req.body);
        const transaction = transactionService.createTransaction(data);
        res.status(201).json(transaction);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json ({ error: err.message });
    }
});

router.get('/', (req, res) => {
    const transactions = transactionService.getAllTransactions();
    res.json(transactions);
});

router.get('/account/:accountId', (req, res) => {
    const transactions = transactionService.getTransactionsByAccount(
        parseInt(req.params.accountId)
    );
    res.json(transactions);
});

export default router;