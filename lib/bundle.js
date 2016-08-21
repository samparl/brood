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
	let cannon = new Cannon();
	
	const step = function() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  Alien.render();
	  cannon.rotate();
	  cannon.draw();
	};
	
	Alien.initializeAliens();
	setInterval(step.bind(this), 10);
	
	let event = new CustomEvent('imagesLoaded');
	window.Alien = Alien;
	// document.body.addEventListener('click', alert("images loaded!"));
	document.addEventListener('keydown', cannon.onKeyDown.bind(cannon));
	document.addEventListener('keyup', cannon.onKeyUp.bind(cannon));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(3);
	var canvas = document.getElementById("brood-canvas");
	let scoreReport = document.getElementById('player-score');
	var ctx = canvas.getContext("2d");
	
	const RADIUS = Constants.RADIUS;
	const SPEED = Constants.SPEED;
	var shotCount = 0;
	var score = 0;
	var aliens = [];
	var topFlush = true;
	var top = 0;
	
	const COLORS = [
	    "blue",
	    "red",
	    "yellow"
	];
	
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
	
	
	const Alien = function(options) {
	  this.color = options.color;
	  this.radius = options.radius;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.alive = true;
	  this.staged = options.staged;
	};
	
	// CLASS METHODS
	
	Alien.drawCeiling = function() {
	  ctx.beginPath();
	  ctx.fillStyle = "#d3d3d3";
	  ctx.rect(0,0,canvas.width, top);
	  ctx.fill();
	  ctx.closePath();
	};
	
	Alien.initializeAliens = function() {
	  for(let level = 0; level < 5; level++){
	    let pos = RADIUS + (level % 2) * RADIUS;
	    while(pos < canvas.width) {
	      let height = RADIUS + level * 2 * RADIUS;
	      let options = {
	        pos: [pos, height],
	        vel: [0,0],
	        color: randomColor(),
	        radius: RADIUS,
	        staged: false
	      };
	
	      aliens.push(new Alien(options));
	      pos += 2 * RADIUS;
	    }
	  }
	};
	
	Alien.collide = function() {
	  for(let i = 0; i < (aliens.length); i++) {
	    for(let j = 0; j < (aliens.length); j++) {
	      if(i != j && aliens[i].alive && aliens[j].alive){
	        if (aliens[i].checkCollision(aliens[j])){
	          aliens[i].lock(aliens[j]);
	          aliens[i].markKills();
	        }
	      }
	    }
	  }
	};
	
	const addNewNodes = function(oldNodes, newNodes) {
	  newNodes.forEach(function(node) {
	    if(!oldNodes.includes(node)) oldNodes.push(node);
	  });
	};
	
	const xDist = function(first, second) {
	  return Math.abs(first.pos[0] - second.pos[0]);
	};
	
	const yDist = function(first, second) {
	  return Math.abs(first.pos[1] - second.pos[1]);
	};
	
	const onCanvas = function(pos) {
	  return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
	};
	
	const killAliens = function(enemies) {
	  enemies.forEach(function(enemy) {
	    enemy.alive = false;
	    score += Constants.POINTS;
	  });
	  updateScore();
	};
	
	const updateScore = function() {
	  scoreReport.textContent = `Your score: ${score}`;
	};
	
	const spaceOccupied = function(pos) {
	  aliens.forEach(function(alien) {
	    if(alien.pos === pos && alien.alive) return true;
	  });
	  return false;
	};
	
	const getTopRow = function() {
	  let topRow = aliens.reduce(function(result, alien) {
	    // debugger
	    if(alien.pos[1] === (top + RADIUS) &&
	      alien.alive) {
	      result.push(alien);
	    }
	    return result;
	  }, []);
	  // debugger
	  return topRow;
	};
	
	
	const resetTop = function() {
	  top += 2 * RADIUS;
	  aliens.forEach(function(alien){
	    alien.pos[1] += 2* RADIUS;
	  });
	};
	
	const countShots = function() {
	  shotCount += 1;
	
	  if(shotCount % 10 === 0) resetTop();
	};
	
	Alien.render = function() {
	  Alien.moveAliens();
	  Alien.collide();
	  Alien.drawCeiling();
	};
	
	Alien.livingAliens = function() {
	  let living = aliens.reduce(function(result, alien) {
	    if(alien.alive) result.push(alien); return result;
	  }, []);
	  return living;
	};
	
	Alien.killUnattached = function() {
	  let attached = Alien.getAttached();
	  aliens.forEach(function(alien){
	    if(
	      !attached.includes(alien) &&
	      !alien.staged &&
	      !alien.isMoving()
	    ) alien.alive = false;
	  });
	};
	
	Alien.moveAliens = function() {
	  aliens.forEach(function(invader) {
	    invader.move();
	  });
	};
	
	const livingAliens = function() {
	  for(let i in aliens) {
	    if(aliens[i].alive) return true;
	  }
	  return false;
	};
	
	const checkWin = function() {
	  if(!livingAliens()) alert("You win!");
	};
	
	Alien.stageAlien = function(){
	  let options = {
	    pos: [canvas.width/2, canvas.height],
	    vel: [0, 0],
	    color: randomColor(),
	    radius: RADIUS,
	    staged: true
	  };
	
	  let newAlien = new Alien(options);
	  aliens.push(newAlien);
	  return newAlien;
	};
	
	Alien.fireCannon = function(angle, alien) {
	  alien.vel = [
	    SPEED * Math.sin(angle),
	    -SPEED * Math.cos(angle)
	  ];
	  alien.staged = false;
	  countShots();
	};
	
	// INSTANCE METHODS
	
	Alien.prototype.draw = function() {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI*2);
	  ctx.fill();
	  ctx.closePath();
	};
	
	Alien.prototype.move = function() {
	  if(!this.alive) return;
	  let newX = (this.pos[0] + this.vel[0]);
	  let newY = (this.pos[1] + this.vel[1]);
	
	  if(!this.bounded(newX)) {
	    newX -= this.vel[0] * 2;
	    this.vel[0] *= -1;
	  }
	
	  if(newY < top){
	    [newX, newY] = this.fixToCeiling(newX);
	  }
	
	  this.pos = [newX, newY];
	  this.draw();
	};
	
	Alien.prototype.bounded = function(x) {
	  let leftBound = x - RADIUS;
	  let rightBound = x + RADIUS;
	  if(rightBound > canvas.width || leftBound < 0) {
	    return false;
	  } else {
	    return true;
	  }
	};
	
	Alien.prototype.fixToCeiling = function(x) {
	  this.stop();
	  const DIAM = 2 * RADIUS;
	  let xOffset = topFlush ? 0 : RADIUS;
	  let effectiveX = x - xOffset;
	  let xBound = DIAM * Math.round((effectiveX)/(DIAM));
	  let newY = top + RADIUS;
	  let newX = RADIUS + xBound;
	  return [newX, newY];
	};
	
	
	Alien.prototype.isMoving = function() {
	  if(this.vel[0] !== 0 || this.vel[1] !== 0) return true;
	  return false;
	};
	
	Alien.prototype.stop = function() {
	  this.vel = [0,0];
	};
	
	Alien.prototype.getSimilarNeighbors = function() {
	  let similarNeighbors = [];
	  for(let j = 0; j < (aliens.length); j++) {
	    if(this.neighboring(aliens[j]) &&
	      this.color === aliens[j].color
	    ) {
	      similarNeighbors.push(aliens[j]);
	    }
	  }
	  return similarNeighbors;
	};
	
	Alien.prototype.getAllNeighbors = function() {
	  let allNeighbors = [];
	  for(let j = 0; j < (aliens.length); j++) {
	    if(this.neighboring(aliens[j])) {
	      allNeighbors.push(aliens[j]);
	    }
	  }
	  return allNeighbors;
	};
	
	Alien.prototype.neighboring = function(neighbor) {
	  if(
	    this !== neighbor &&
	    xDist(this, neighbor) <= RADIUS * 2 &&
	    yDist(this, neighbor) <= RADIUS * 2 &&
	    neighbor.alive
	  ) {
	    return true;
	  } else{
	    return false;
	  }
	};
	
	Alien.prototype.getSimilarCluster = function(nodeList) {
	  nodeList = nodeList || [];
	  if(!nodeList.includes(this)) nodeList.push(this);
	
	  this.getSimilarNeighbors().forEach(function(neighbor) {
	    if(!nodeList.includes(neighbor)) {
	      let newList = neighbor.getSimilarCluster(nodeList);
	      return addNewNodes(nodeList, newList);
	    }
	  });
	
	  return nodeList;
	};
	
	Alien.prototype.getFullCluster = function(nodeList) {
	  nodeList = nodeList || [];
	  if(!nodeList.includes(this)) nodeList.push(this);
	
	  this.getAllNeighbors().forEach(function(neighbor) {
	    if(!nodeList.includes(neighbor) && neighbor.alive) {
	      let newList = neighbor.getFullCluster(nodeList);
	      return addNewNodes(nodeList, newList);
	    }
	  });
	
	  return nodeList;
	};
	
	Alien.getAttached = function() {
	  let topAliens = getTopRow();
	  let attached = [];
	  topAliens.forEach(function(alien) {
	    if(attached.includes(alien)) return;
	    let cluster = alien.getFullCluster();
	    addNewNodes(attached, cluster);
	  });
	  return attached;
	};
	
	Alien.prototype.lock = function(otherAlien) {
	  let pos = [];
	  let x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
	  let y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
	  let maj_axis = y_dist > x_dist ? 0 : 1;
	  let min_axis = y_dist > x_dist ? 1 : 0;
	  axial_dist = Math.abs(this.pos[maj_axis] - otherAlien.pos[maj_axis]);
	
	  pos[1] = otherAlien.pos[1];
	  let x_offset = (this.pos[0] > otherAlien.pos[0]) ? 2 * RADIUS : -2 * RADIUS;
	  pos[0] = otherAlien.pos[0] + x_offset;
	
	  if(maj_axis === 0 || !spaceOccupied(pos)) {
	    pos[1] = otherAlien.pos[1] + 2 * RADIUS;
	    let x_offset = (this.pos[0] > otherAlien.pos[0]) ? RADIUS : -RADIUS;
	    pos[0] = otherAlien.pos[0] + x_offset;
	    if(!onCanvas(pos)) pos[0] += 2 * x_offset;
	  }
	  this.pos = pos;
	  this.stop();
	};
	
	Alien.prototype.markKills = function() {
	  let neighbors = this.getSimilarCluster();
	  if(neighbors.length >2){
	    killAliens(neighbors);
	    Alien.killUnattached();
	    checkWin();
	  }
	};
	
	Alien.prototype.checkCollision = function (otherAlien) {
	  let x_dist = xDist(this, otherAlien);
	  let y_dist = yDist(this, otherAlien);
	  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
	    return this.isMoving() ? true : false;
	  }
	};
	
	
	module.exports = Alien;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(3);
	const Alien = __webpack_require__(1);
	
	const canvas = document.getElementById("brood-canvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();
	img.src = '../assets/images/cannon.png';
	let DELTA = Constants.DELTA;
	let RADIUS = Constants.RADIUS;
	
	const Cannon = function() {
	  this.color = "#d3d3d3";
	  this.length = canvas.height/5;
	  this.width = RADIUS * 2.5;
	  this.angle = 0;
	  this.spaceDown = false;
	  this.stagedAlien = null;
	};
	
	const drawCannon = function() {
	  ctx.translate(canvas.width/2, canvas.height);
	  ctx.translate(-canvas.width/2, -canvas.height);
	};
	
	Cannon.prototype.draw = function() {
	
	  ctx.translate(canvas.width/2, canvas.height);
	  ctx.rotate(this.angle);
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.rect(-this.width/2, -this.length * 3 / 2, this.width, this.length);
	  ctx.fill();
	  ctx.closePath();
	
	  ctx.beginPath();
	  ctx.arc(0, 0, this.length/2, 0, 2 * Math.PI, false);
	  ctx.strokeStyle = this.color;
	  ctx.lineWidth = 10;
	  ctx.stroke();
	  ctx.closePath();
	
	  ctx.rotate(-this.angle);
	  ctx.translate(-canvas.width/2, -canvas.height);
	
	};
	
	Cannon.prototype.onKeyDown = function(e) {
	
	  if(e.keyCode === 39) {
	    this.direction = "right";
	  }
	  if(e.keyCode === 37) {
	    this.direction = "left";
	  }
	  if(e.keyCode === 32) {
	    e.preventDefault();
	    if(!this.spaceDown) {
	      this.stagedAlien = Alien.stageAlien();
	    }
	    this.spaceDown = true;
	  }
	};
	
	Cannon.prototype.onKeyUp = function(e) {
	  this.direction = null;
	  this.spaceDown = false;
	  if(e.keyCode === 32) Alien.fireCannon(this.angle, this.stagedAlien);
	};
	
	
	Cannon.prototype.rotate = function() {
	  if(this.direction === "right") {
	    this.angle += DELTA;
	  }
	  if(this.direction === "left") {
	    this.angle -= DELTA;
	  }
	};
	
	module.exports = Cannon;


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  RADIUS: 25,
	  DELTA: 0.05,
	  SPEED: 7,
	  POINTS: 10
	};


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map