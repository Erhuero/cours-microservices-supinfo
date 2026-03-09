import express from 'express';
import accountRoutes from './routes/accounts.js';

const app = express();

app.use(express.json());

app.use('/accounts', accountRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Account Service v1.0 "});
});

export default app;