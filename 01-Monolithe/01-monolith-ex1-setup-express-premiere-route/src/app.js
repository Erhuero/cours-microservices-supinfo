import express from 'express';
import userRoutes from './routes/users.js';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: "BigBank API v1.0" });
});

export default app;