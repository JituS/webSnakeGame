var express = require('express');
var http = require('http');
var app = express();
var highscore = 0;
var myFood = {};
app.use(express.static('public/.'));

app.get('/', function(req, res){
	res.redirect('snake.html');
});

app.get('/food', function(req, res){
	myFood.x = Math.floor(Math.random()*40) * 10;
	myFood.y = Math.floor(Math.random()*40) * 10;
	res.json(myFood);
});

var validate = function(food, score){
	console.log(score, highscore, myFood, food);
	console.log(+score > highscore && food.x == myFood.x && food.y == myFood.y);
	return +score > highscore && food.x == myFood.x && food.y == myFood.y;
}

app.post('/highscore', function(req, res){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	});
	req.on('end',function(){
		var score = +data.split('&')[0].split('=')[1];
		var food = JSON.parse(data.split('&')[1].split('=')[1]);
		if(validate(food, score)){
			highscore = score;
			res.end(highscore.toString());
		}else{
			res.end(highscore.toString());
		}
	});
})
var server = http.createServer(app).listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
