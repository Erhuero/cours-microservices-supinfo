Pour l'exo 5, on termine avec un changement très simple.

Dans docker-compose on ajoute un volume dans rabbitmq (cherchez dans le fichier la ligne volumes dans rabbitmq)
N'oubliez pas de déclarer ce nouveau volume dans la partie volumes

Le volume sers a garder tous les messages de RabbitMQ s'il est détruit avec un docker compose down. 
En revanche, si on utilise docker compose down -v alors tout sera détruit.