import { Router } from 'express';
import * as apiService from '../services/api.service.js';

const router = Router();

/**
 * @swagger
 * /admin/users:
 *  get:
 *      summary: Tous les utilisateurs
 *      description: Vue admin qui retourne tous les utilisateurs sans pagination
 *      tags: [Admin]
 *      responses:
 *          200:
 *              description: Liste complete des utilisateurs
 */
router.get('/users', async (req, res) => {
     try {
         const users = await apiService.getAllUsers();
         res.json(users);
     } catch (err) {
         res.status(err.status || 500).json({ error: err.message });
     }
});

/**
 * @swagger
 * /admin/users/{id}:
 *  get:
 *      summary: Utilisateur avec ces comptes
 *      description: Retourne l'utilisateur et tous ces comptes bancaires
 *      tags: [Admin]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Utilisateur et ses comptes
 *          404:
 *              description: Non trouve
 */
router.get('/users/:id', async (req, res) => {
    try{
        const user = await apiService.getUserById(req.params.id);
        const accounts = await apiService.getAccountsByUser(req.params.id);
        res.json({ ...user, accounts});
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /admin/transactions:
 *  get:
 *      summary: Toutes les transactions
 *      description: Liste complete sans pagination pour la vue admin
 *      tags: [Admin]
 *      responses:
 *          200:
 *              description: Liste complete des transaction
 */
router.get('/transactions', async (req, res) => {
    try{
        const transactions = await apiService.getAllTransactions();
        res.json(transactions);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /admin/overview:
 *  get:
 *      summary: Vue d'ensemble du système
 *      description: Dashboard - aggregation de tous les services utilisés dans le module Microservices (users, accounts, transactions)
 *      tags: [Admin]
 *      responses:
 *          200:
 *              description: Overview complet
 */
router.get('/overview', async (req, res) => {
    try{
        const overview = await apiService.getFullOverview();
        res.json(overview);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});

export default router;