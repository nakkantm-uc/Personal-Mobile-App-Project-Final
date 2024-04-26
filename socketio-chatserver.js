/* A Simple HTTP server with socket.IO in Node.js by Phu Phung */
var http = require('http'), fs = require('fs');
var httpServer = http.createServer(httphandler);
var xssfilter = require("xss");
var socketio = require('socket.io')(httpServer);
var port = 8081;
httpServer.listen(port); 
console.log("HTTPS server is listenning on port "+ port);

function httphandler (request, response) {
  response.writeHead(200); // 200 OK 
  //ensure you have the front-end UI client.html
  var clientUI_stream = fs.createReadStream('./client.html');
  clientUI_stream.pipe(response);
}
socketio.on('connection', function (socketclient) {
  console.log("A new socket.IO client is connected: "+ 
             socketclient.client.conn.remoteAddress+": "+
             socketclient.id); 

  console.log("Connected Clients");
  var sockets = socketio.sockets.sockets;
  for(var socketId in sockets)
  {
    var socketclients = sockets[socketId];
    console.log(socketclients.client.conn.remoteAddress+ ":" + socketclients.id);
  }


  socketclient.on("message",(data)=>{
    var data = xssfilter(data);
    console.log("Received data: " + data);
    data = socketclient.id + " says : " + data;

    socketio.emit("message",data);
  });

  socketclient.on("typing",() =>{
    console.log("Someone is Typing....");
    socketio.emit("typing");
  });

  socketclient.on('disconnect', function(msg){
    console.log(socketclient.client.conn.remoteAddress+":"+socketclient.id + '  is disconnected');
    socketio.emit("msg");
  });
});