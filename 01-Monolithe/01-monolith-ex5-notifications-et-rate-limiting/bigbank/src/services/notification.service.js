let notifications = [];
let nextId = 1;

export function notifyTransfer(transaction, fromAccount, toAccount){

    const notification = {
        id: nextId++,
        accountId: fromAccount.id,
        type: "transfer_sent",
        message: `Virement de ${transaction.amount} EUR vers le compte #${toAccount.id} (${toAccount.label})`,
        description: transaction.description || null,
        transactionId: transaction.id,
        read: false,
        createdAt: new Date().toISOString()
    };

    notifications.push(notification);

    const timestamp = new Date().toLocaleString('fr-FR');
    console.log('\n===================================');
    console.log('===NOTIFICATION - Transfert effectué===');
    console.log('\n===================================');
    console.log(`Date      : ${timestamp}`);
    console.log(`De        : Compte #${fromAccount.id} (${fromAccount.label})`);
    console.log(`Vers      : Compte #${toAccount.id} (${toAccount.label})`);
    console.log(`Montant   : ${transaction.amount} €`);
    console.log(`Desc      : ${transaction.description || 'Aucune'}`);
    console.log('===================================\n');

    return notification;

}

export function getNotificationsByAccount(accountId) {
    return notifications.filter(n => n.accountId === accountId);
}

export function getAllNotifications() {
    return notifications;
}