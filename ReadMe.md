# PlayThemAll

This project (which was originally started to test NodeJS and sockets, but still in developpment) aims to build a game plateform.
People will be able 
- to reserve a pseudo
- Connect to lobbies
- Chat in lobbies
- play different games

For chat and games, I use sockets, for a real time experience !
If this project picks your interest, let me know !


As of today, only Chess is available, but i plan to add more later !

Here is a live version (but unfortunately very ugly) : [https://guarded-depths-27498.herokuapp.com/](https://guarded-depths-27498.herokuapp.com/)

## Dependencies :

This project needs NodeJs to run, as well as :
- Express, a framework 
- EJS, the templating language
- Passport, an authentication middleware for Node.js
- MongoDB, a noSQL database
- Socket.io, the real-time engine for the chats and games.
- Connect-..., sessions store.
	
You can install with the following command :
```
npm install
```

For the games actually provided, this project also uses :
- [Chess.js](https://github.com/jhlywa/chess.js) (which is modified)


## TODO

The following still needs to be done :

Some features to implement (By prioritizing) :
- Add explanations for players
- Surrender
- Lobby functions
- Update spectator mode.
- Delay before disconnection
- Prevent double connections.


Appearance : 
- Need to do add a client side complementary project (such as an Angular project), to play different games.



## Authors

* **Eyap53** - *Initial work* - [Eyap53](https://github.com/Eyap53)


## License

This project is licensed under the GNU GPL License - see the [LICENSE](LICENSE) file for details



