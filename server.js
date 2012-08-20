
/**
* Prepare APIs
**/
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , static = require('node-static')
  , Pusher = require('node-pusher')
  
/**
* Create pusher object
**/
var pusher = new Pusher({
	appId : '21595',
	key: 'ea4e88ebf3b60b6d309f',
	secret: 'a4b0bfe3e7c4072aeb71'});

/**
* Start server on port 8080
**/
var fserv = new  static.Server('./client');
app.listen(8080);

/** 
* Create handler to publish index.html 
* Could be tweaked to handle any requested page
**/
function handler (req, res) {
	req.addListener('end',function(){
		fserv.serve(req,res);
	});
}

/**
* On a connection, tell the client the public 
* and private channels they can use to communicate.
* A private message will be delivered only to the client
* A public message will be delivered to all clients
**/
io.sockets.on('connection', function (socket) {
	//console.log(socket);
	
	//Tell clients their pusher channel information
	socket.emit('channel-public', { channel: 'channel-public' });
	socket.emit('channel-private', { channel: 'channel-'+socket.id });
	
	//Async register for private trigger request
	socket.on('trigger-private', function (data) {
		pusher.trigger('channel-'+socket.id, 'event', {message : 'hello private'});
	});
	
	//Async register for public trigger request
	socket.on('trigger-public',function(data){
		pusher.trigger('channel-public', 'event', {message : 'hello public'});
	});
});