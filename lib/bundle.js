/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Alien = __webpack_require__(1);
	
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	
	// var x = canvas.width/2;
	// var y = canvas.height - 30;
	// var pos = [x,y];
	var dx = 1;
	var dy = 1;
	var vel = [dx, dy];
	
	const COLORS = [
	    "blue",
	    "red",
	    "yellow"
	];
	
	const RADIUS = 20;
	
	const randomColor = function() {
	  return COLORS[Math.floor(Math.random() * 3)];
	};
	
	const randomVelocity = function() {
	  let x = Math.random() * 2 - 1;
	  let y = Math.random() * 2 - 1;
	  let speed = Math.random();
	  x = x / Math.sqrt(x * x + y * y);
	  y = y / Math.sqrt(x * x + y * y);
	  return [x, y];
	};
	
	const aliens = [];
	
	for(let i = 0; i < 5; i++) {
	  let coefficient = 40;
	  let options = {
	    pos: [40 + coefficient * i, 40],
	    vel: randomVelocity(),//[0,0],
	    color: randomColor(),
	    radius: RADIUS
	  };
	  aliens.push(new Alien(options));
	}
	
	const checkCollisions = function() {
	  for(let i = 0; i < (aliens.length - 1); i++) {
	    for(let j = i + 1; j < aliens.length; j++) {
	      console.log([i, j]);
	      aliens[i].stopIfCollidingWith(aliens[j]);
	    }
	  }
	};
	
	const moveAliens = function() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  aliens.forEach(function(invader) {
	    invader.move();//.bind(invader);
	  });
	};
	
	const step = function() {
	  moveAliens();
	  checkCollisions();
	};
	
	setInterval(step.bind(this), 10);


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	
	var x = canvas.width/2;
	var y = canvas.height - 30;
	var pos = [x,y];
	var dx = 1;
	var dy = 1;
	var vel = [dx, dy];
	const RADIUS = 20;
	
	const Alien = function(options) {
	  this.color = options.color;
	  this.radius = options.radius;
	  this.pos = options.pos;
	  this.vel = options.vel;
	};
	
	Alien.prototype.draw = function() {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI*2);
	  ctx.fill();
	  ctx.closePath();
	};
	
	Alien.prototype.move = function() {
	  this.pos[0] = (this.pos[0] + this.vel[0]) % canvas.width;
	  this.pos[1] = (this.pos[1] + this.vel[1]) % canvas.height;
	  this.draw();
	};
	
	Alien.prototype.stop = function() {
	  this.vel = [0,0];
	};
	
	Alien.prototype.lock = function(otherAlien) {
	
	};
	
	Alien.prototype.stopIfCollidingWith = function (otherAlien) {
	  x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
	  y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
	  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
	    this.stop();
	    otherAlien.stop();
	  } else {
	    // debugger
	  }
	};
	
	
	module.exports = Alien;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map