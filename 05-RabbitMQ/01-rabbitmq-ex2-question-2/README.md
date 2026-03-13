OUI, queue necessaire.

bigbank : transaction-service : une transaction bancaire ne doit JAMAIS être perdue. 
Actuellement c'est un appel HTTP synchrone : si transaction-service crash pendant le traitement, la transaction est perdue.
Avec une queue, le message reste jusqu'a ce qu'il soit traite et acknowledge.

L'appel de transaction-service pars vers notification-service : l'envoi de notification (email/SMS) apres une transaction est une obligation legale.
Actuellement si notification-service est down, l'appel HTTP echoue silencieusement (try/catch dans le code). 
Avec une queue, la notification sera délivrée dès que le service revient.

Dans le cas ou nous n'avons pas besoin de file d'attente.
bigbank : user-service (CRUD users) : appel synchrone, le client ATTEND la reponse (creation de compte, login). 
Il a besoin du resultat immediatement.

bigbank : account-service (CRUD accounts) : meme chose, le client veut voir son compte cree tout de suite.
transaction-service : account-service (mise a jour des soldes) : le traitement de la transaction a besoin 
du resultat de la mise a jour du solde pour pouvoir acknowledge.

Regle de base :
Queue = quand le producteur n'a PAS besoin de la reponse pour continuer (asynchrone)
HTTP direct = quand le producteur ATTEND la reponse pour continuer (synchrone)
