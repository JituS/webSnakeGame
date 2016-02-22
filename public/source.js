var interval = null;

var snake = {
	body: null,
	direction: null
};

var food = {
	x:100,
	y:30
}

var init = function(){
	snake.body = [
		{x:30, y:390},
		{x:30, y:380},
		{x:30, y:370},
	];
	snake.direction = "down";
};

var directions = {
	up:function(){
		state.curruntStatus = "resume";
		if(snake.direction == "down"){
			snake.body = snake.body.reverse();
		}
		eatFood();
		var preX = snake.body[0].x;
		var preY = snake.body[0].y;
		snake.body[0].y = snake.body[0].y-=10;
		printSnake(preX, preY);
		snake.direction = "up";
	    isDead();
	},

	down:function(){
		state.curruntStatus = "resume";
		if(snake.direction == "up"){
			snake.body = snake.body.reverse();
		}
		eatFood();
		var preX = snake.body[0].x;
		var preY = snake.body[0].y;
		snake.body[0].y = snake.body[0].y+=10;
		printSnake(preX, preY);
		snake.direction = "down";
	    isDead();
	},

	left:function(){
		state.curruntStatus = "resume";
		if(snake.direction == "right"){
			snake.body = snake.body.reverse();
		}
		eatFood();
		var preX = snake.body[0].x;
		var preY = snake.body[0].y;
		snake.body[0].x = snake.body[0].x-=10;
		printSnake(preX, preY);
		snake.direction = "left";	    		
		isDead();
	},

	right:function(){
		state.curruntStatus = "resume";
		if(snake.direction == "left"){
			snake.body = snake.body.reverse();
		}
		eatFood();
		var preX = snake.body[0].x;
		var preY = snake.body[0].y;
		snake.body[0].x = snake.body[0].x+=10
		printSnake(preX, preY);
		snake.direction = "right";	    	
		isDead();
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

var eatFood = function(){
	if(snake.body[0].x == food.x && snake.body[0].y == food.y){
		var score = document.querySelector(".score");
		var currentScore = score.textContent.split(":")[1];
		document.querySelector(".score").textContent = "Score:" + (++currentScore);
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
}

var isDead = function(){
	if(snake.body[0].x == -10
		||snake.body[0].y == -10
		||snake.body[0].x == 600
		||snake.body[0].y == 600){
		clearInterval(interval);
		document.querySelector(".score").textContent = "Score:0";
		reset();
	}
	for(var i = 1; i < snake.body.length; i++){
		if(snake.body[0].x == snake.body[i].x && snake.body[0].y == snake.body[i].y){
			clearInterval(interval);
			document.querySelector(".score").textContent = "Score:0";
			reset();
		}
	}
}

var createPlayArea = function(){
	var playArea = document.querySelector("#playArea");
	playArea.style.width = "600px";
	playArea.style.height = "600px";
	for(var i = 0; i < 600;i+=10){
		var elements = [];
		for(var j = 0; j < 600;j+=10){
			var element = document.createElement("div");
			var food = document.querySelector(".food");
			element.setAttribute("class", "pixel");
			element.style.marginTop = i + "px";
			element.style.marginLeft = j + "px";
			playArea.insertBefore(element, food);
		}
	}
};

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
    	clearInterval(interval);
        interval = setInterval(directions.up, 50);
    }
    else if (e.keyCode == '40') {
    	clearInterval(interval);
        interval = setInterval(directions.down, 50);
    }
    else if (e.keyCode == '37') {
    	clearInterval(interval);
        interval = setInterval(directions.left, 50);
    }
    else if (e.keyCode == '39') {
    	clearInterval(interval);
        interval = setInterval(directions.right, 50);
    }
}

var main = function(){
	init();
	createPlayArea();
	createSnake();
	produceFood();
	document.onkeydown = checkKey;
	document.querySelector("#pause").onclick = state.pause;
	document.querySelector("#resume").onclick = state.resume;
};

window.onload = main;