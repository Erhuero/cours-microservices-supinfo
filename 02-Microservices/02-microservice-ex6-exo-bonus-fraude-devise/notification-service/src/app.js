import express from 'express';
import notifyRoutes from './routes/notify.js';
import {setupSwagger} from "./swagger.js";

const app = express();

app.use(express.json());

setupSwagger(app);

app.use('/notify',notifyRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Notification Service v1.0" });
});

export default app;