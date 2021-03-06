"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1339;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

var app=require('./app');  // database module

/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

 
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() {
  console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  var connection = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event
  var index = clients.push(connection) - 1;
 
 
    
    app.getDatabase()	
	.then(() => app.getCollectionUrl('notification'))  
    .then(() => app.getCollection())
	.then(() =>    {console.log('conncetion established to notificatin collection!'); } ); 	
	
	setInterval(function(){ 
  
      app.queryCollection()
	 .then(() =>  {console.log(app.infoModel); 
	 
	 var json={};
	 if( app.infoModel.length>0)
	 {
	  json = JSON.stringify(app.infoModel[0]);
	  
	    if(ValidateLastMinData(app.infoModel[0].Time))
		{
		for (var i=0; i < clients.length; i++) {
			clients[i].sendUTF(json);
		}
	  }
	 }
	 
	 });


	}, 10000);

  console.log((new Date()) + '  ' +index + ' Connection accepted.');

   

  // user sent some message
  connection.on('message', function(message) {
     
	 console.log(message);
	  
  });

  // user disconnected
  connection.on('close', function(connection) {
    
	console.log('connectin closed' + connection);
  });
})


 function ValidateLastMinData(objecttime)
 {
	 var objectDate = new Date(objecttime);
 
	var objectUTCDate = new Date(objectDate.getUTCFullYear(), objectDate.getUTCMonth(), objectDate.getUTCDate(),  objectDate.getUTCHours(), objectDate.getUTCMinutes(), objectDate.getUTCSeconds());

	var currentdate =new Date();
	var currentUTCdate = new Date(currentdate.getUTCFullYear(), currentdate.getUTCMonth(), currentdate.getUTCDate(),  currentdate.getUTCHours(), currentdate.getUTCMinutes(), currentdate.getUTCSeconds());
 
 
    var utcOneMinAgo =new Date(currentUTCdate.getTime() - 1000 * 60);
	
	console.log(objectUTCDate);
	console.log(currentUTCdate);
	console.log(utcOneMinAgo);
	
	if( objectUTCDate<=currentUTCdate &&  objectUTCDate>=utcOneMinAgo)
		return true;
	else 
		return false;
 }


