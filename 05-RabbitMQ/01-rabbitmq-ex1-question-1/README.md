Ex-1 : Quand utiliser une message queue ?

On utilise une message queue dans ces cas :
Traitement asynchrone : quand le client n'a pas besoin d'attendre la fin du traitement. 
Par exemple, envoyer un email apres une transaction, le client veut juste savoir que sa transaction est acceptee, 
pas attendre que l'email parte.

Decouplage des services : quand le service B (notification) n'est plus disponible (ou down), 
le service A (transaction) ne doit PAS echouer. 

La queue (file d'attente) stocke le message et le delivre quand B revient.
Fiabilité / zero perte de donnees : les operations critiques (transactions bancaires, emails légaux) 
ne doivent JAMAIS être perdues, meme si un service crash.

Pics de charge : la file d'attente absorbe les pics (100 transactions/seconde) et les consommateurs traitent a leur rythme.
Regle "par defaut" : on utilise une queue quand la communication entre services est de type "fire and forget" 
(je publie, je n'attends pas la reponse) ou quand la perte d'un message serait inacceptable.
