Pour l'exo 4 on remplace les appels HTTp par RabbitMQ:

Ajoutez la ligne RABBITMQ_URL dans notification-service dans docker-compose (regardez ce qui a été modifié)

Changez aussi la fonction notifyTransfer dans le fichier transaction.service.js dans le service transaction-service.

Le service ouvre une deuxième connexion RabbitMQ vers la queue notifications en plus de consommer la queue transactions.

```
async function notifyTransfer(transaction, fromAccount, toAccount){
    notifChannel.sendToQuee('notifications', Buffer.from(JSON.stringify({   }) { persistent: true });
}
```

Ensuite créez un nouveau fichier queue.consumer.js dans les services de notification-service. Ce fichier permettra 
d'écouter la queue notifications et d'afficher les d"tails du virement dans les logs quand un message arrive. 
On ajoute channel.ack(msg) a la fin de channel consume pour confirmer le traitement.

