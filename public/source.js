var interval = null;

var snake = {
	body: null,
	direction: null,
	score: 0
};

var food = {
	x:100,
	y:30
}

var init = function(){
	snake.body = [
		{x:30, y:390, background:'black'},
		{x:30, y:380, background:'black'},
		{x:30, y:370, background:'red'},
	];
};

var tasks = {
	increment:function(cordinate){
		snake.body[0][cordinate]+=10;
	},
	decrement:function(cordinate){
		snake.body[0][cordinate]-=10;
	}
}

var move = function(direction, task, taskOn){
	state.curruntStatus = "resume";
	eatFood();
	var preX = snake.body[0].x;
	var preY = snake.body[0].y;
	task(taskOn);
	printSnake(preX, preY);
	snake.direction = direction;
	isDead();
}

var directions = {
	up:function(){
		move("up", tasks.decrement, 'y');
	},
	down:function(){
		move("down", tasks.increment, 'y');
	},
	left:function(){
		move("left", tasks.decrement, 'x');
	},
	right:function(){
		move("right", tasks.increment, 'x');
	}
};

var state = {
	pause:function(){
		if(state.curruntStatus == "resume"){
			state.curruntStatus = "pause";
			clearInterval(interval);
		}
	},
	resume:function(){
		if(state.curruntStatus == "pause"){
			state.curruntStatus = "resume";
			directions[snake.direction]();
			interval = setInterval(directions[snake.direction], 50);
		}
	},
	curruntStatus:"resume"
}

var createSnake = function(){
	for(var  i = 0; i < snake.body.length; i++){
		var element = document.createElement("div");
		element.style.background = snake.body[i].background;
		element.setAttribute("class", "snake");
		element.style.marginLeft = snake.body[i].x + "px"; 
		element.style.marginTop = snake.body[i].y + "px"; 
		document.querySelector("#playArea").appendChild(element);
	}
}

var printSnake = function(preX, preY){
	removeSnake();
	for(var i = 1; i < snake.body.length;i++){
		var _preX = snake.body[i].x;
		var _preY = snake.body[i].y;
		snake.body[i].y = preY;
		snake.body[i].x = preX;
		preX = _preX;
		preY = _preY;
	}
	createSnake();
}

var scoreRequest = function(score){
	var req = new XMLHttpRequest()
	req.onreadystatechange = function(){
	    if (req.readyState == 4 && req.status == 200) {
	    	console.log(req.responseText)
	    	document.querySelector('#highscore').textContent = "Highscore:"+(+req.responseText);
		}
	}
	req.open('post', 'highscore', false);
	req.send('highScore='+score+'&snake='+JSON.stringify(snake));
}

var eatFood = function(){
	if(snake.body[0].x == food.x && snake.body[0].y == food.y){
		var soundTag = document.querySelector('#eat');
		soundTag.play();
		var score = document.querySelector(".score");
		var currentScore = ++snake.score;
		document.querySelector(".score").textContent = "Score:" + (currentScore);
		scoreRequest(currentScore);
		snake.body.push({x:snake.body[0].x, y:snake.body[0].y});
		produceFood();
	}
};

var produceFood = function(){
	food.x = Math.floor(Math.random()*40) * 10;
	food.y = Math.floor(Math.random()*40) * 10;
	var element = document.querySelector(".food");
	element.style.marginLeft = food.x + "px";
	element.style.marginTop = food.y + "px";
};

var removeSnake = function(){
	var element = document.querySelectorAll(".snake");
	for(var  i = 0; i < element.length; i++){
		element[i].parentNode.removeChild(element[i]);
	}
}

var reset = function(){
	snake.body = [
		{x:30, y:390},
		{x:30, y:380},
		{x:30, y:370},
	];
	removeSnake();
	init();
	createSnake();
	snake.direction = null;
	snake.score = 0;
	snake.body.reverse();
}

var resetGame = function(){
	clearInterval(interval);
	var crash = document.querySelector('#crash');
	crash.play();
	document.querySelector(".score").textContent = "Score:0";
	reset();
}

var isDead = function(){
	if(snake.body[0].x == -10
		||snake.body[0].y == -10
		||snake.body[0].x == 500
		||snake.body[0].y == 500){
		resetGame();
	}
	for(var i = 1; i < snake.body.length; i++){
		if(snake.body[0].x == snake.body[i].x && snake.body[0].y == snake.body[i].y){
			resetGame();
		}
	}
}

var createPlayArea = function(){
	var playArea = document.querySelector("#playArea");
	playArea.style.width = "500px";
	playArea.style.height = "500px";
	for(var i = 0; i < 500;i+=10){
		var elements = [];
		for(var j = 0; j < 500;j+=10){
			var element = document.createElement("div");
			var food = document.querySelector(".food");
			element.setAttribute("class", "pixel");
			element.style.marginTop = i + "px";
			element.style.marginLeft = j + "px";
			playArea.insertBefore(element, food);
		}
	}
};

var keyCodes = {'38':{canGo:'up',cantGo:'down'},'39':{canGo:'right',cantGo:'left'},'40':{canGo:'down',cantGo:'up'},'37':{canGo:'left',cantGo:'right'}};

var chooseDirection = function(direction){
	if(snake.direction !== direction.cantGo){
		clearInterval(interval);
	    interval = setInterval(directions[direction.canGo], 55);
	}
}

function checkKey(e) {
    e = e || window.event;
    chooseDirection(keyCodes[e.keyCode]);
}

var main = function(){
	document.querySelector('a').onclick = function(){
		document.querySelector('.main').setAttribute("class","main");
		document.querySelector('.header').setAttribute("class","header");
		var middleHeader = document.querySelector('#middleHeader')
		middleHeader.parentNode.removeChild(middleHeader);		
		var topHeader = document.querySelector('#topHeader')
		topHeader.parentNode.removeChild(topHeader);
	}
	init();
	createPlayArea();
	createSnake();
	produceFood();
	scoreRequest(0);
	snake.body.reverse();
	document.onkeydown = checkKey;
	document.querySelector("#pause").onclick = state.pause;
	document.querySelector("#resume").onclick = state.resume;
};

window.onload = main;