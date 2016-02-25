var interval = null;

var Snake = function(){
	this.body = null;
	this.direction = null;
	this.food = {};
}

Snake.prototype.init = function(){
	this.body = [
		{x:30, y:390, background:'black'},
		{x:30, y:380, background:'black'},
		{x:30, y:370, background:'red'},
	];
	this.produceFood();
}

Snake.prototype.produceFood = function(){
	var req = new XMLHttpRequest()
	var self = this;
	req.onreadystatechange = function(){
	    if (req.readyState == 4 && req.status == 200){
	    	var food = JSON.parse(req.responseText);
			var element = document.querySelector(".food");
			element.style.marginLeft = food.x + "px";
			element.style.marginTop = food.y + "px";
			document.querySelector(".food").style.background = "black";
			self.food = food;
		}
	}
	req.open('get', 'food', true);
	req.send();
};


Snake.prototype.eatFood = function(){
	if(this.body[0].x == this.food.x && this.body[0].y == this.food.y){
		document.querySelector(".food").style.background = "#d8d8d8";
		var soundTag = document.querySelector('#eat');
		soundTag.play();
		var score = document.querySelector(".score");
		var currentScore = score.textContent.split(":")[1];
		document.querySelector(".score").textContent = "Score:" + (++currentScore);
		scoreRequest(currentScore, this.food);
		this.body.push({x:this.body[0].x, y:this.body[0].y});
		this.produceFood();
	}
}

var tasks = {
	increment:function(cordinate, snake){
		snake.body[0][cordinate]+=10;
	},
	decrement:function(cordinate, snake){
		snake.body[0][cordinate]-=10;
	}
}

Snake.prototype.move = function(direction, task, taskOn){
	state.curruntStatus = "resume";
	this.eatFood();
	var preX = this.body[0].x;
	var preY = this.body[0].y;
	task(taskOn, this);
	this.print(preX, preY);
	this.direction = direction;
	this.isDead();
}


Snake.prototype.isDead = function(){
	if(this.body[0].x == -10
		||this.body[0].y == -10
		||this.body[0].x == 500
		||this.body[0].y == 500){
		this.remove();
		resetGame();
	}
	for(var i = 1; i < this.body.length; i++){
		if(this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y){
			this.remove();
			resetGame();
		}
	}	
}

Snake.prototype.createSnakeBody = function(){
	for(var  i = 0; i < this.body.length; i++){
		var element = document.createElement("div");
		element.style.background = this.body[i].background;
		element.setAttribute("class", "snake");
		element.style.marginLeft = this.body[i].x + "px"; 
		element.style.marginTop = this.body[i].y + "px"; 
		document.querySelector("#playArea").appendChild(element);
	}
}

Snake.prototype.print = function(preX, preY){
	this.remove();
	for(var i = 1; i < this.body.length;i++){
		var _preX = this.body[i].x;
		var _preY = this.body[i].y;
		this.body[i].y = preY;
		this.body[i].x = preX;
		preX = _preX;
		preY = _preY;
	}
	this.createSnakeBody();
}

var directions = {
	up:function(snake){
		snake.move("up", tasks.decrement, 'y');
	},
	down:function(snake){
		snake.move("down", tasks.increment, 'y');
	},
	left:function(snake){
		snake.move("left", tasks.decrement, 'x');
	},
	right:function(snake){
		snake.move("right", tasks.increment, 'x');
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



var scoreRequest = function(score, preFood){
	var req = new XMLHttpRequest()
	req.onreadystatechange = function(){
	    if (req.readyState == 4 && req.status == 200) {
	    	document.querySelector('#highscore').textContent = "Highscore:"+(+req.responseText);
		}
	}
	req.open('post', 'highscore', true);
	req.send('highScore='+score+'&preFood='+JSON.stringify(preFood));
}

Snake.prototype.remove = function(){
	var element = document.querySelectorAll(".snake");
	for(var  i = 0; i < element.length; i++){
		element[i].parentNode.removeChild(element[i]);
	}

}

var reset = function(){
	var snake = new Snake();
	snake.init();
	snake.createSnakeBody();
	snake.direction = null;
	snake.body.reverse();
	document.onkeydown = function(e){
		checkKey(e, snake);
	}
}

var show = function(){
	var notification = document.querySelector('#information');
	notification.textContent = 'Your snake is dead';
	document.querySelector('.main').setAttribute("class","main hidden");
	document.querySelector('.header').setAttribute("class","header hidden");
	var middleHeader = document.querySelector('#middleHeader')
	middleHeader.setAttribute('class','show');		
	var topHeader = document.querySelector('#topHeader')
	topHeader.setAttribute('class','show');			
}

var resetGame = function(){
	show();
	clearInterval(interval);
	var crash = document.querySelector('#crash');
	crash.play();
	document.querySelector(".score").textContent = "Score:0";
	reset();
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

var chooseDirection = function(direction, snake){
	if(snake.direction !== direction.cantGo){
		clearInterval(interval);
	    interval = setInterval(function(){
	    	directions[direction.canGo](snake);
	    }, 55);
	}
}

function checkKey(e, snake) {
    e = e || window.event;
    chooseDirection(keyCodes[e.keyCode], snake);
}

var main = function(){
	document.querySelector('a').onclick = function(){
		document.querySelector('.main').setAttribute("class","show main");
		document.querySelector('.header').setAttribute("class","show header");
		var middleHeader = document.querySelector('#middleHeader')
		middleHeader.setAttribute('class', 'hidden');		
		var topHeader = document.querySelector('#topHeader')
		topHeader.setAttribute('class','hidden');
	}
	createPlayArea();
	var snake = new Snake();
	snake.init();
	snake.createSnakeBody();
	scoreRequest(0, snake.food);
	snake.body.reverse();
	document.onkeydown = function(e){
		checkKey(e, snake);
	}
	document.querySelector("#pause").onclick = state.pause;
	document.querySelector("#resume").onclick = state.resume;
};

window.onload = main;