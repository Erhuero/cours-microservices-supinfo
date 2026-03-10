import express from 'express';
import adminRoutes from './routes/admin.js';
import {setupSwagger} from "../swagger.js";
import rateLimit from "express-rate-limit";

const app = express();

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    message: { error: "Trop de requêtes, réessayez dans une minute" }
});

app.use(limiter);

app.use(express.json());

setupSwagger(app);

app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: "BigBank Admin API v1.0" });
});

export default app;