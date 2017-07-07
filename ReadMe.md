ALPHA
===========

- Structure simple


Problèmes actuel :

- Si tu actualise la page ça bug
- Si le leader quitte le salon plus personne ne peux lancer le jeu

TODO :


- Actuellement; toute la logique est coté client. Je voudrais la ramenner coté serveur.
On ré-utilise le meme fichier chess.js; en l'integrant avec les sockets; et en utilisant l'API.
Par contre, je peux réduire le coté client à juste les coups légaux. Pas vraiment besoin de tout mémoriser deux fois.


- Rajouter un mode spectateur.
- De meme, faire en sorte qu'un mec ne puisse pas rejoindre deux fois le salon. (ou plutot que ca soit la meme page)


- Mettre un game over (voir les fcts de chess/js)
- gerer les égalités
- gerer le surrender
- gerer le quittage de salon (remettre la place dispo, etc... Mettre un délai de 1sec). en partie, délai de 10 sec.


autre TODO :
- Faire en sorte que y'ai plusieurs room possible, donc plusieurs game
- Mettre en place l'IA aléatoire

Affichage :
- rendre ça plus joli, esthetique.
- Afficher qui est en train de jouer, et les personnes présentes sur la partie