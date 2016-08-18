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

	const Constants = __webpack_require__(3);
	const Alien = __webpack_require__(1);
	const Cannon = __webpack_require__(2);
	
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	
	const COLORS = [
	    "blue",
	    "red",
	    "yellow"
	];
	
	const RADIUS = Constants.RADIUS;
	const SPEED = Constants.SPEED;
	
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
	
	const getVelocity = function(vector){
	  let x = vector[0];
	  let y = vector[1];
	  let result = [
	    x/Math.sqrt(x * x + y * y),
	    y/Math.sqrt(x * x + y * y)
	  ];
	  return result;
	};
	
	const aliens = [];
	
	const shootAlien = function(){
	  let options = {
	    pos: [canvas.width/2, canvas.height],
	    vel: getVelocity([-1, -2]),
	    color: randomColor(),
	    radius: RADIUS
	  };
	
	  newAlien = new Alien(options);
	  aliens.push(newAlien);
	};
	
	placeRandomAliens = function(start_x, end_x, y, likelihood) {
	  let pos = start_x;
	  // Use the "chain" variable to track how many consecutive aliens have been placed
	  let chain = 0;
	  let next_likelihood = likelihood - 0.15;
	  // let placement_likelihood = 0.75;
	  let chance;
	  while(pos < end_x) {
	    chance = Math.random();
	    if(chance < likelihood){
	      let options = {
	        pos: [pos, y],
	        vel: [0,0],
	        color: randomColor(),
	        radius: RADIUS
	      };
	      aliens.push(new Alien(options));
	      chain += 1;
	    } else {
	      if(chain > 1 && next_likelihood > 0){
	        placeRandomAliens(
	          pos - (2 * RADIUS * chain) + RADIUS,
	          pos - (2 * RADIUS),
	          y + 2 * RADIUS,
	          next_likelihood
	        );
	      }
	      chain = 0;
	    }
	
	    pos += 2 * RADIUS;
	  }
	// Call placeAliens on the length approaching the final chain
	  if(chain > 1){
	    // debugger
	    placeRandomAliens(
	      pos - (2 * RADIUS * chain) + RADIUS,
	      pos - (2 * RADIUS),
	      y + 2 * RADIUS,
	      next_likelihood
	    );
	  }
	};
	
	const placeAlienRows = function() {
	  for(let level = 0; level < 5; level++){
	    let pos = RADIUS + (level % 2) * RADIUS;
	    while(pos < canvas.width) {
	      let height = RADIUS + level * 2 * RADIUS;
	      let options = {
	        pos: [pos, height],
	        vel: [0,0],
	        color: randomColor(),
	        radius: RADIUS
	      };
	
	      aliens.push(new Alien(options));
	      pos += 2 * RADIUS;
	    }
	  }
	};
	
	const checkCollisions = function() {
	  for(let i = 0; i < (aliens.length); i++) {
	    for(let j = 0; j < (aliens.length); j++) {
	      if(i !=j) aliens[i].stopIfCollidingWith(aliens[j]);
	    }
	  }
	};
	
	const moveAliens = function() {
	  aliens.forEach(function(invader) {
	    invader.move();//.bind(invader);
	  });
	};
	
	const fireCannon = function() {
	  let options = {
	    pos: [canvas.width/2, canvas.height],
	    vel: [
	      SPEED * Math.cos(cannon.angle),
	      SPEED * Math.sin(cannon.angle)
	    ],
	    color: randomColor(),
	    radius: RADIUS
	  };
	
	  newAlien = new Alien(options);
	  aliens.push(newAlien);
	};
	
	const step = function() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  cannon.rotate();
	  cannon.draw();
	  moveAliens();
	  checkCollisions();
	};
	
	// placeRandomAliens(RADIUS, canvas.width, RADIUS, 1);
	placeAlienRows();
	setInterval(step.bind(this), 10);
	shootAlien();
	let cannon = new Cannon();
	document.addEventListener('keydown', cannon.onKeyDown.bind(cannon));
	document.addEventListener('keyup', cannon.onKeyUp.bind(cannon));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(3);
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	
	const RADIUS = Constants.RADIUS;
	
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
	  let new_x = (this.pos[0] + this.vel[0]);
	  if(new_x > canvas.width || new_x < 0) {
	    new_x -= this.vel[0] * 2;
	    this.vel[0] *= -1;
	  }
	  let new_y = (this.pos[1] + this.vel[1]);
	  this.pos[0] = new_x;// % canvas.width;
	  this.pos[1] = new_y;// % canvas.height;
	  this.draw();
	};
	
	Alien.prototype.isMoving = function() {
	  // debugger
	  if(this.vel[0] !== 0 || this.vel[1] !== 0) return true;
	  return false;
	};
	
	Alien.prototype.stop = function() {
	  this.vel = [0,0];
	};
	
	Alien.prototype.lock = function(otherAlien) {
	  let pos = [];
	  let x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
	  let y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
	  let maj_axis = y_dist > x_dist ? 0 : 1;
	  let min_axis = y_dist > x_dist ? 1 : 0;
	  axial_dist = this.pos[maj_axis] - otherAlien.pos[maj_axis];
	
	  if(axial_dist <= RADIUS) {
	    pos[maj_axis] = otherAlien.pos[maj_axis];
	  } else if(this.pos[maj_axis] > otherAlien.pos[maj_axis]) {
	    pos[maj_axis] = otherAlien.pos[maj_axis] + RADIUS;
	  } else {
	    pos[maj_axis] = otherAlien.pos[maj_axis] - RADIUS;
	  }
	
	  pos[min_axis] = this.pos[min_axis] > otherAlien.pos[min_axis] ?
	    otherAlien.pos[min_axis] + 2 * RADIUS :
	    otherAlien.pos[min_axis] - 2 * RADIUS;
	  this.pos = pos;
	  this.stop();
	};
	
	Alien.prototype.stopIfCollidingWith = function (otherAlien) {
	  let x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
	  let y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
	  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
	    if(this.isMoving()) {
	      this.lock(otherAlien);
	    }
	    // this.stop();
	    // otherAlien.stop();
	  }
	};
	
	
	module.exports = Alien;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(3);
	
	const canvas = document.getElementById("brood-canvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();
	img.src = '../assets/images/cannon.png';
	let DELTA = Constants.DELTA;
	
	const Cannon = function() {
	  this.color = "blue";//options.color;
	  this.length = 80;
	  this.width = 20;
	  this.angle = 0;
	};
	
	drawCannon = function() {
	  ctx.translate(canvas.width/2, canvas.height);
	  ctx.translate(-canvas.width/2, -canvas.height);
	};
	
	Cannon.prototype.draw = function() {
	
	  // ctx.translate(canvas.width/2, canvas.height);
	  // ctx.rotate(angle);
	  // ctx.drawImage(img, 0, -150, 200, 100);
	  // ctx.rotate(-angle);
	  // ctx.translate(-canvas.width/2, -canvas.height);
	  // debugger
	
	  ctx.translate(canvas.width/2, canvas.height);
	  ctx.rotate(this.angle);
	  ctx.fillStyle = "#000";
	  ctx.beginPath();
	  ctx.rect(-this.width/2, -this.length, this.width, this.length);
	  ctx.fill();
	  ctx.closePath();
	  ctx.rotate(-this.angle);
	  ctx.translate(-canvas.width/2, -canvas.height);
	
	};
	
	Cannon.prototype.onKeyDown = function(e) {
	  if(e.keyCode === 39) {
	    this.keydown = "right";
	  }
	  if(e.keyCode === 37) {
	    this.keydown = "left";
	  }
	};
	
	Cannon.prototype.onKeyUp = function(e) {
	  this.keydown = null;
	};
	
	
	Cannon.prototype.rotate = function() {
	  if(this.keydown === "right") {
	    this.angle += DELTA;
	  }
	  if(this.keydown === "left") {
	    this.angle -= DELTA;
	  }
	};
	
	module.exports = Cannon;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  RADIUS: 10,
	  DELTA: 0.1,
	  SPEED: 4
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map