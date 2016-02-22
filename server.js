var express = require('express');
var http = require('http');
var app = express();

app.use(express.static('public/.'));
app.get('/', function(req, res){
	console.log('--')
	res.redirect('snake.html');
})
var server = http.createServer(app).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
