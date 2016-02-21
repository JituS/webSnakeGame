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
};

var eatFood = function(){
	if(snake.body[0].x == food.x && snake.body[0].y == food.y){
		var score = document.querySelector(".score");
		var currentScore = score.textContent.split(":")[1];
		document.querySelector(".score").textContent = "Score:" + (++currentScore);
		snake.body.push({x:null, y:null});
		var element = document.createElement("div");
		element.setAttribute("class", "snake");
		element.style.marginLeft = snake.body[0].x + "px"; 
		element.style.marginTop = snake.body[0].y + "px"; 
		document.querySelector("#playArea").appendChild(element);
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

var upArrow = function(){
	eatFood();
	var element = document.querySelectorAll(".snake");
	var preX = element[0].style.marginLeft;
	var preY = element[0].style.marginTop;
	element[0].style.marginTop = (snake.body[0].y-=10) + "px";
	for(var i = 1; i < element.length;i++){
		var _preX = element[i].style.marginLeft;
		var _preY = element[i].style.marginTop;
		snake.body[i].y = element[i].style.marginTop = preY;
		snake.body[i].x = element[i].style.marginLeft = preX;
		preX = _preX;
		preY = _preY;
	}
	snake.direction = "top";
    isDead();
};

var downArrow = function(){
	eatFood();
	var element = document.querySelectorAll(".snake");
	var preX = element[0].style.marginLeft;
	var preY = element[0].style.marginTop;
	element[0].style.marginTop = (snake.body[0].y+=10) + "px";
	for(var i = 1; i < element.length;i++){
		var _preX = element[i].style.marginLeft;
		var _preY = element[i].style.marginTop;
		snake.body[i].y = element[i].style.marginTop = preY;
		snake.body[i].x = element[i].style.marginLeft = preX;
		preX = _preX;
		preY = _preY;
	}
	snake.direction = "down";
    isDead();
};

var leftArrow = function(){
	eatFood();
	var element = document.querySelectorAll(".snake");
	var preX = element[0].style.marginLeft;
	var preY = element[0].style.marginTop;
	element[0].style.marginLeft = (snake.body[0].x-=10) + "px";
	for(var i = 1; i < element.length;i++){
		var _preX = element[i].style.marginLeft;
		var _preY = element[i].style.marginTop;
		snake.body[i].y = element[i].style.marginTop = preY;
		snake.body[i].x = element[i].style.marginLeft = preX;
		preX = _preX;
		preY = _preY;
	}
	snake.direction = "left";	    		
	isDead();
};

var rightArrow = function(){
	eatFood();
	var element = document.querySelectorAll(".snake");
	var preX = element[0].style.marginLeft;
	var preY = element[0].style.marginTop;
	element[0].style.marginLeft = (snake.body[0].x+=10) + "px";
	for(var i = 1; i < element.length;i++){
		var _preX = element[i].style.marginLeft;
		var _preY = element[i].style.marginTop;
		snake.body[i].y = element[i].style.marginTop = preY;
		snake.body[i].x = element[i].style.marginLeft = preX;
		preX = _preX;
		preY = _preY;
	}
	snake.direction = "right";	    	
	isDead();
};

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
    	clearInterval(interval);
        interval = setInterval(upArrow, 50);
    }
    else if (e.keyCode == '40') {
    	clearInterval(interval);
        interval = setInterval(downArrow, 50);
    }
    else if (e.keyCode == '37') {
    	clearInterval(interval);
        interval = setInterval(leftArrow, 50);
    }
    else if (e.keyCode == '39') {
    	clearInterval(interval);
        interval = setInterval(rightArrow, 50);
    }
}

var reset = function(){
	snake.body = [
		{x:30, y:390},
		{x:30, y:380},
		{x:30, y:370},
	];
	var element = document.querySelectorAll(".snake");
	for(var  i = 0; i < element.length; i++){
		element[i].parentNode.removeChild(element[i]);
	}
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

var createSnake = function(){
	for(var  i = 0; i < snake.body.length; i++){
		var element = document.createElement("div");
		element.setAttribute("class", "snake");
		element.style.marginLeft = snake.body[i].x + "px"; 
		element.style.marginTop = snake.body[i].y + "px"; 
		document.querySelector("#playArea").appendChild(element);
	}
}

var main = function(){
	init();
	createPlayArea();
	createSnake();
	document.onkeydown = checkKey;
	produceFood();
};

window.onload = main;