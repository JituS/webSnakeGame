var express = require('express');
var http = require('http');
var app = express();
var highscore = 0;
app.use(express.static('public/.'));
app.get('/', function(req, res){
	res.redirect('snake.html');
});

app.post('/highscore', function(req, res){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	});
	req.on('end',function(){
		var score = data.split('=')[1];
		if(+score > highscore){
			highscore = score;
		}
	});
	res.send(highscore);
})
var server = http.createServer(app).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
