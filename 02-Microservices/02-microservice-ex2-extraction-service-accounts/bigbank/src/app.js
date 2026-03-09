import express from 'express';
import userRoutes from './routes/users.js';
import accountRoutes from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/users/:userId/accounts', accountRoutes);
app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.json({ message: "BigBank API v1.0" });
});

export default app;