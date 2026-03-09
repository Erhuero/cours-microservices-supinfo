import { Router } from 'express';
import { createTransactionSchema } from '../schemas/transaction.schema.js';
import * as transactionService from '../services/transaction.service.js';

const router = Router();

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


export default router;