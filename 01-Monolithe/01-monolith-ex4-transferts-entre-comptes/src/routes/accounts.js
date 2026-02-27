import { Router } from 'express';
import { createAccountSchema, updateAccountSchema } from '../schemas/account.schema.js';
import * as accountService from '../services/account.service.js';

const router = Router({ mergeParams: true });

router.post('/', (req, res) => {
    try {
        const data = createAccountSchema.parse(req.body);
        const account = accountService.createAccount(parseInt(req.params.userId), data);
        res.status(201).json(account);
    } catch (err) {
        if (err.errors) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.get('/', (req, res) => {
    try{
        const accounts = accountService.getAccountsByUser(parseInt(req.params.userId));
        res.json(accounts);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message});
    }
});

router.get('/:id', (req, res) => {
    try{
        const account = accountService.getAccountById(
            parseInt(req.params.userId),
            parseInt(req.params.id)
        );
        res.json(account);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

router.put('/:id', (req, res) => {
    try {
        const data = updateAccountSchema.parse(req.body);
        const account = accountService.updateAccount(
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

router.delete('/:id', (req, res) => {
    try{
        accountService.deleteAccount(
            parseInt(req.params.userId),
            parseInt(req.params.id)
        );
        res.status(204).send();
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;