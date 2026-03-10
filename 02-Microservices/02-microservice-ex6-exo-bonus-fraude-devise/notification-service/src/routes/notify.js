import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Envoyer une notification
 *     description: Notifie les comptes concernes d'une transaction. Appelee par le consumer RabbitMQ.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Notification envoyee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notification envoyee avec succes"
 *                 timestamp:
 *                   type: string
 *                   example: "05/03/2026 14:30:00"
 */
router.post('/', (req, res) => {
    const { fromAccount, toAccount, amount, description } = req.body;

    const timestamp = new Date().toLocaleString('fr-FR');

    console.log("\n======================================");
    console.log('NOTIFICATION SERVICE (port 3002)');
    console.log("===================================");
    console.log(`Date     : ${timestamp}`);
    console.log(`De       : Compte : #${fromAccount.id} (${fromAccount.label})`);
    console.log(`Vers       : Compte : #${toAccount.id} (${toAccount.label})`);
    console.log(`Montant  : ${amount} €`);
    console.log(`Desc.    : ${description || 'Aucune'}`);
    console.log("\n=======================================");

    res.status(200).json({
        success: true,
        message: "Notification envoyée avec succès",
        timestamp
    });
});

export default router;