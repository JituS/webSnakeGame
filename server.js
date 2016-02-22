var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('./'));
app.get('/', function(req, res){
	res.redirect('snake.html');
})
http.createServer(app).listen(8080);