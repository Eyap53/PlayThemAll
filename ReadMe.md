# PlayThemAll

NodeJs Project to play games in real-time. Today, only Chess is available, but there will be more later !
It is planned to develop a lobby system. Don't hesitate to fork the project and make a pull request if interested !

A live version will be available soon.

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

The following still need to be done :

Some feature to implement (By priority)
- Things are working, but it's not efficient. There is a need to improve it all, (it will be easier later for the implementation of other games).

- surrender
- Lobby functions
- Add spectatory mode.
- Delay to the disconnect
- Be careful about double connections.

Appearance : 
- Need to do add a client side complementary project (such as a Angular project), to play different games.



## Authors

* **Mael Lacour** - *Initial work* - [LacourMael](https://github.com/LacourMael)


## License

This project is licensed under the GNU GPL License - see the [LICENSE.md](LICENSE.md) file for details



