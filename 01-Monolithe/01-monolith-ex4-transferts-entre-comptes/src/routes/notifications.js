import { Router } from 'express';
import * as notificationService from '../services/notification.service.js';

const router = Router();

router.get('/', (req, res) => {
    res.json(notificationService.getAllNotifications());
});

router.get('/account/:accountId', (req, res) => {
    const notifications = notificationService.getNotificationsByAccount(
        parseInt(req.params.accountId)
    );
    res.json(notifications);
});

export default router;