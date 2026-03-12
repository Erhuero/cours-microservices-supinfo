import express from 'express';
import userRoutes from './routes/users.js';
import accountRoutes from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';
import rateLimit from "express-rate-limit";
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:8080' }));

app.use(express.json());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    message: { error: "Trop de requêtes, réessayez dans une minute" }
});

app.use(limiter);

app.use('/users', userRoutes);
app.use('/users/:userId/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.json({ message: "BigBank API v1.0" });
});

export default app;