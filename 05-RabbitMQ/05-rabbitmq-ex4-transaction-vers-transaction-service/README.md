Pour l'exo 3 on aborde le principe producer et consumer
Ici on commence a intégrer RabbitMQ. Le changement se passe entre big-bank qui publie le message dans la queue "transations"
et transaction-service consomme.

On ajoute dans le service bigbank le queue.service.js et on modifie le fichier routes.transactions.js et on modifie routes/transactions.js
ou on va modifier la logique (on passe du fetch a la publication)

IUl faut ensuite modifier le transaction-service en ajoutant queue.consumer.js qui lui devient consumer (consommateur) puis ne pas oublier
de rajouter RABBITMQ_URL dans docker-compose

Compléter ensuite le docker-compose en ajoutant le service rabbitmq + RABBITMQ_URL dans la partie bigbank et transaction-service 
(les services ou on a ajouté les queue.consumer et .service)