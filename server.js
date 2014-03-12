var util = require("util"),	
  url = require("url"),
	io = require("socket.io"),
  http = require('http'),
	fs = require('fs');

// the game runner

(function (a) {
  var $ = a.root = {
    'a': a, 'v': {'player': {}},
    'f': (function () {
      return {       
        move: function (data) {
        	var p = $.v.player[this.id];
        	if (p) {
        	  p.c = data.c;
            p.dx = data.dx;
            p.dy = data.dy;
          	this.broadcast.emit("move", {"id": this.id, "c": data.c, "dx": data.dx, "dy": data.dy });
          }
        },
        join: function (data) {
          var t = (this.id.charCodeAt(0) % 2);
          var p = {
            'id': this.id,
            'c': t,
            'dx': 0,
            'dy': 0
          };
        	$.v.player[this.id] = p;
        	this.broadcast.emit("join", {"id": this.id, "c": t, "dx": 0, "dy": 0 });
        	util.log('New player: ' + this.id);
        },               

        clientDisconnect: function () {
        	util.log("Player has disconnected: " + this.id);
        	var p = $.v.player[this.id];
        	if (!p) {
        		util.log("Player not found: " + this.id);
        	} else {
        	  delete $.v.player[this.id];
          	this.broadcast.emit("leave", {id: this.id});          	
          }       	
        },      
        
        init: function () {                 
         	$.v.io = io.listen(8000);
        	$.v.io.configure(function() {
        		$.v.io.set("transports", ["websocket"]);
        		$.v.io.set("log level", 2);
        	}); 
        	$.v.io.sockets.on("connection", 
        	  function (socket) {
            	socket.on("disconnect", $.f.clientDisconnect);
            	socket.on("join", $.f.join);
            	socket.on("move", $.f.move);
            }
          );
          var fakeIcon = function(res) {
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            res.end();
          };

          var consoleHtml = '';
          fs.readFile('./console.html', function (err, data) {
            if (err) {
              util.log('error reading console page');
            } else {
              consoleHtml = data.toString();
              util.log('console page ready to serve');
            }
          });
          
          var writeConsole = function(res) {
            res.writeHead(200, {'Content-Type': 'text/html'} );
            res.write(consoleHtml);
            res.end();
          };
          
          var handleConsoleRequest = function(req, res) {
            if (req.url === '/favicon.ico') {
              fakeIcon(res);
            } else {
              writeConsole(res);
            }
          };
          
          var consoleWriter = http.createServer();
          consoleWriter.addListener("request", handleConsoleRequest);
          consoleWriter.listen(8001);
          
          // the client page lives on port 8080
          
          var clientHtml = '';
          
          fs.readFile('./client.html', function (err, data) {
            if (err) {
              util.log('error reading client page');
            } else {
              clientHtml = data.toString();
              util.log('client page ready to serve');
            }
          });
          
          var writeClient = function(res) {
            res.writeHead(200, {'Content-Type': 'text/html'} );
            res.write(clientHtml);
            res.end();
          };
          
          var handleClientRequest = function(req, res) {
            if (req.url === '/favicon.ico') {
              fakeIcon(res);
            } else {
              writeClient(res);
            }
          };
          
          var clientWriter = http.createServer();
          clientWriter.addListener("request", handleClientRequest);
          clientWriter.listen(8080);          

        }
      };
    }())
  }; 
  $.f.init();     
}({
  'root': 'SERVER'
} ));