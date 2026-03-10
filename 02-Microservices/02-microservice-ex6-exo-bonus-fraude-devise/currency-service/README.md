Initialisation de pom.xml avec https://start.spring.io/

Spring Boot Web : le serveur HTTP embarqué (Tomcat) + les annotations REST. C'est l'équivalent d'Express.js.
SpringDoc OpenAPI : génère automatiquement le Swagger UI depuis les annotations Java. Équivalent de swagger-jsdoc + swagger-ui-express côté Node.js.
Spring Boot Actuator : expose /actuator/health pour que Docker puisse vérifier si le service est vivant (healthcheck).

L'annotation @Service dit a Spring : "cree une instance unique 
de cette classe et injecte-la partout ou on en a besoin". 
C'est le pattern Singleton + Dependency Injection.

En Node.js, on fait un simple module avec des fonctions exportees. 
En Java/Spring, on utilise l'injection de dependances pour 
decoupler les couches (controller -> service -> repository).

Controlleur REST du service de devises.

En Spring, un @RestController est l'equivalent d'un Router Express. 
Chaque methode annotee @GetMapping / @PostMapping est une route.

La difference avec Express :
- Express : router.get('/convert', (req, res) => { ... })
- Spring  : @GetMapping("/convert") public ExchangeRate convert(...) { ... }

Spring serialise automatiquement le retour en JSON (via Jackson). 
Pas besoin de res.json() explicite.

# Terminal 1 — notification-service (port 3002)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/notification-service
node index.js

# Terminal 2 — account-service (port 3003)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/account-service
node index.js

# Terminal 3 — user-service (port 3004)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/user-service
node index.js

# Terminal 4 — transaction-service (port 3005)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/transaction-service
node index.js

# Terminal 5 — fraud-detection-service (port 3006)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/fraud-detection-service
source venv/bin/activate
python app.py

# Terminal 6 — bigbank (port 3000)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/bigbank
node index.js

# Terminal 7 — bigbank-admin (port 3001)
cd /Users/constantin/Documents/MicroService/02-Microservices/02-microservice-ex6-exo-bonus-fraude-devise/bigbank-admin
node index.js