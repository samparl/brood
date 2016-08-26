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

	const Constants = __webpack_require__(1);
	const Game = __webpack_require__(2);
	
	let game = new Game();
	
	game.setup();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var greenAlien = new Image();
	greenAlien.src = "assets/images/aliens/smiley_green_alien.svg";
	var blueAlien = new Image();
	blueAlien.src = "assets/images/aliens/smiley_blue_alien.svg";
	var redAlien = new Image();
	redAlien.src = "assets/images/aliens/smiley_red_alien.svg";
	var orangeAlien = new Image();
	orangeAlien.src = "assets/images/aliens/smiley_orange_alien.svg";
	var purpleAlien = new Image();
	purpleAlien.src = "assets/images/aliens/smiley_purple_alien.svg";
	
	
	
	module.exports = {
	  NUMROWS: 1,
	  LOSSHEIGHT: 640,
	  RADIUS: 50,
	  X_SPACING: 50 * Math.sqrt(3) / 2,
	  VERTICES: 6,
	  DELTA: 0.075,
	  SPEED: 10,
	  POINTS: 10,
	  COLORS: [
	      "blue",
	      "red",
	      "yellow"
	  ],
	  TYPES: [
	    greenAlien,
	    blueAlien,
	    purpleAlien,
	    redAlien,
	    orangeAlien
	  ]
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	const Brood = __webpack_require__(3);
	const Cannon = __webpack_require__(6);
	
	const SPEED = Constants.SPEED;
	const RADIUS = Constants.RADIUS;
	
	var playFrame = $("#play");
	let scoreReport = document.getElementById('player-score');
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	var gameInterval;
	
	const Game = function(options) {
	  this.top = 0;
	  this.shotCount = 0;
	  this.score = 0;
	  this.topFlush = true;
	  this.brood = new Brood({game: this});
	  this.cannon = new Cannon();
	  // window.testAlien = this.brood.movingAliens[0];
	};
	
	// IS THIS STILL NEEDED?
	Game.reset = function() {
	  this.top = 0;
	  this.loss = false;
	  this.win = false;
	  initializeAliens();
	};
	
	//////// GAMEPLAY
	
	Game.prototype.step = function() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  this.drawCeiling();
	  // this.brood.renderAliens();
	  this.brood.stepAliens();
	  this.cannon.rotate();
	  this.cannon.draw();
	  if(this.brood.loss) {
	    this.end("You lose!");
	  } else if(this.brood.win){
	    this.end("You win!");
	  }
	};
	
	Game.prototype.updateScore = function() {
	  this.score += Constants.POINTS;
	  scoreReport.textContent = `Your score: ${ this.score }`;
	};
	
	Game.prototype.countShots = function() {
	  this.shotCount += 1;
	  // if(this.shotCount % 10 === 0) this.resetTop();
	};
	
	Game.prototype.resetTop = function() {
	  this.top += 2 * RADIUS;
	  this.brood.shiftAliens();
	};
	
	Game.prototype.drawCeiling = function() {
	  ctx.beginPath();
	  ctx.fillStyle = "#d3d3d3";
	  ctx.rect(0,0,canvas.width, this.top);
	  ctx.fill();
	  ctx.closePath();
	};
	
	//////// START/STOP PLAY METHODS
	
	Game.prototype.setup = function() {
	  $replay.remove();
	  gameInterval = setInterval(this.step.bind(this), 10);
	  var event = new CustomEvent('imagesLoaded');
	  var keydownEvent = document.addEventListener('keydown', this.onKeyDown.bind(this));
	  var keyupEvent = document.addEventListener('keyup', this.onKeyUp.bind(this));
	};
	
	Game.prototype.end = function(text) {
	  console.log("The end");
	  document.removeEventListener('keydown', this.onKeyDown.bind(this));
	  document.removeEventListener('keyup', this.onKeyUp.bind(this));
	  clearInterval(gameInterval);
	  $replay.text(`${ text } Play again?`);
	  $replay.append('<i class="fa fa-refresh" aria-hidden="true"></i>');
	  $replay.on("click", ".fa-refresh", playAgain);
	  playFrame.append($replay);
	};
	
	const playAgain = function() {
	  let game = new Game();
	  game.setup();
	};
	
	//////// LISTENERS AND THEIR CALLBACKS
	
	Game.prototype.onKeyDown = function(e) {
	  // debugger
	  if(e.keyCode === 39) {
	    this.cannon.direction = "right";
	  } else if(e.keyCode === 37) {
	    this.cannon.direction = "left";
	  } else if(e.keyCode === 32) {
	    e.preventDefault();
	    if(!this.cannon.spaceDown) {
	      this.cannon.stagedAlien = this.brood.stageAlien();
	    }
	    this.cannon.spaceDown = true;
	  }
	};
	
	Game.prototype.onKeyUp = function(e) {
	  this.cannon.direction = null;
	  this.cannon.spaceDown = false;
	  if(e.keyCode === 32) this.fireCannon(this.cannon.angle, this.cannon.stagedAlien);
	};
	
	Game.prototype.fireCannon = function(angle, alien) {
	  alien.vel = [
	    SPEED * Math.sin(angle),
	    -SPEED * Math.cos(angle)
	  ];
	  alien.staged = false;
	  this.countShots();
	};
	
	
	const $replay = $(`<div width=${canvas.width} height=${canvas.height} class='replay'>
	  </div>`);
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	const Alien = __webpack_require__(4);
	const Util = __webpack_require__(5);
	
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	
	const RADIUS = Constants.RADIUS;
	const xSpacing = RADIUS * Math.sqrt(3) / 2;
	const SPEED = Constants.SPEED;
	
	var coolAlien = new Image();
	coolAlien.src = "assets/images/aliens/green/Smiley_green_alien_big_eyes.svg";
	
	const Brood = function(options) {
	  this.game = options.game;
	  this.aliens = initializeAliens(this.game);
	  this.movingAliens = {};
	  this.shotCount = 1;
	};
	
	initializeAliens = function(game) {
	  let aliens = [];
	  for(let level = 0; level < Constants.NUMROWS; level++){
	    let pos = xSpacing + (level % 2) * xSpacing;//RADIUS + (level % 2) * RADIUS;
	    while(pos + xSpacing < canvas.width) {
	      let height = RADIUS + level * 2 * RADIUS;
	      let options = {
	        pos: [pos, height],
	        vel: [0,0],
	        color: Util.randomColor(),
	        type: Util.randomType(),
	        radius: RADIUS,
	        staged: false,
	        alive: true,
	        game: game
	      };
	
	      aliens.push(new Alien(options));
	      pos += 2 * xSpacing;//RADIUS * Math.cos(Math.PI / 3);
	    }
	  }
	  return aliens;
	};
	
	
	Brood.prototype.stageAlien = function(){
	  this.shotCount += 1;
	  if(this.shotCount % 10 === 0) this.resetTop();
	  let options = {
	    id: this.shotCount,
	    pos: [canvas.width/2, canvas.height - Constants.RADIUS],
	    vel: [0, 0],
	    color: Util.randomColor(),
	    type: Util.randomType(),
	    radius: RADIUS,
	    staged: true,
	    alive: true,
	    game: this.game
	  };
	  let newAlien = new Alien(options);
	  // this.aliens.push(newAlien);
	  // this.movingAliens.push(newAlien);
	  this.movingAliens[this.shotCount] = newAlien;
	  return newAlien;
	};
	
	/////////// TESTING NOT FOR USE YET
	
	Brood.prototype.stepAliens = function() {
	  this.moveAliens();
	  this.checkAllCollisions();
	  this.renderAllAliens();
	};
	
	Brood.prototype.moveAliens = function() {
	  for(let id in this.movingAliens){
	    let alien = this.movingAliens[id];
	    alien.move();
	  }
	};
	
	Brood.prototype.moveAlien = function(alien) {
	  let pos = alien.move();
	  pos = this.checkCeiling(pos, alien);
	  pos = this.checkForCollision(alien);
	  alien.pos = pos;
	};
	
	Brood.prototype.checkCeiling = function(pos, alien) {
	  if(pos[1] < this.game.top){
	    pos = this.fixToCeiling(pos[0]);
	  }
	  return pos;
	};
	
	Brood.prototype.checkForCollision = function(pos, alien) {
	  for(let i = 0; i < this.aliens.length; i++) {
	    if(
	      alien.alive &&
	      this.aliens[i].alive &&
	      alien !== this.aliens[i] &&
	      alien.collidingWith(this.aliens[i])
	    ) {
	      let angle = this.findAngle(alien, this.aliens[i]);
	      alien.setPosition(this.aliens[i], angle);
	      this.stop(alien);
	      this.markKills(alien);
	    }
	  }
	};
	
	Brood.prototype.renderAllAliens = function() {
	  this.renderMovingAliens();
	  this.renderAliens();
	};
	
	Brood.prototype.renderAliens = function() {
	  this.aliens.forEach(function(alien) {
	    alien.draw();
	  });
	};
	
	Brood.prototype.renderMovingAliens = function() {
	  for(let id in this.movingAliens) {
	    this.movingAliens[id].draw();
	  }
	};
	
	Brood.prototype.checkAllCollisions = function() {
	  let numberMovingAliens = Object.keys(this.movingAliens).length;
	  for(let id in this.movingAliens) {
	    this.checkAlienCollisions(this.movingAliens[id]);
	  }
	};
	
	Brood.prototype.checkAlienCollisions = function(alien) {
	  for(let i = 0; i < this.aliens.length; i++) {
	    if(
	      alien.alive &&
	      this.aliens[i].alive &&
	      alien !== this.aliens[i] &&
	      alien.collidingWith(this.aliens[i])
	    ) {
	      console.log("registering");
	      let angle = this.findAngle(alien, this.aliens[i]);
	      alien.setPosition(this.aliens[i], angle);
	      this.stop(alien);
	      this.markKills(alien);
	    }
	  }
	};
	
	Brood.prototype.findAngle = function(alien, otherAlien) {
	  let angle = alien.angleWith(otherAlien);
	  let angles = Alien.sortedAngles(angle);
	  for(let i = 0; i < angles.length; i++) {
	    if(!this.isOccupied(alien, angles[i])){
	      angle = angles[i];
	      break;
	    }
	  }
	  // debugger
	  return angle;
	};
	
	Brood.prototype.isOccupied = function(alien, angle) {
	  // debugger
	  let pos = [
	    alien.pos[0] + 2 * RADIUS * Math.cos(angle),
	    alien.pos[1] + 2 * RADIUS * Math.sin(angle)
	  ];
	
	  for(let i = 0; i < this.aliens.length; i++) {
	    if(Util.inRange(pos, this.aliens[i].pos)){
	      // debugger
	      return true;
	    }
	  }
	  return false;
	};
	
	Brood.prototype.alienAt = function(pos) {
	  // debugger
	  for(let i = 0; i < this.aliens.length; i++) {
	    if(this.aliens[i].alive &&
	      Util.inRange(pos, this.aliens[i].pos)) {
	      return  true;
	    }
	  }
	  return false;
	};
	
	Brood.prototype.stop = function(alien){
	  alien.stop();
	  delete this.movingAliens[alien.id];
	  this.aliens.push(alien);
	};
	
	////////// UTILITY FUNCTIONS
	
	const addNewNodes = function(oldNodes, newNodes) {
	  newNodes.forEach(function(node) {
	    if(!oldNodes.includes(node)) oldNodes.push(node);
	  });
	};
	
	Brood.prototype.resetTop = function() {
	  this.game.top += 2 * Constants.RADIUS;
	  this.shiftAliens();
	};
	
	Brood.prototype.shiftAliens = function() {
	  this.aliens.forEach(function(alien){
	    alien.pos[1] += 2 * RADIUS;
	  });
	};
	
	////////////// KILL FUNCTIONS
	
	Brood.prototype.markKills = function(alien) {
	  let neighbors = this.getSimilarCluster(alien);
	  // debugger
	  if(neighbors.length > 2){
	    this.killAliens(neighbors);
	    this.killUnattached();
	    // debugger
	    this.checkWin();
	  }
	};
	
	Brood.prototype.killUnattached = function() {
	  let attached = this.getAttached();
	  console.log("unattached triggers");
	  this.aliens.forEach(function(alien){
	    if(
	      !attached.includes(alien) &&
	      !alien.staged
	    ) alien.kill();
	  });
	};
	
	Brood.prototype.killAliens = function(enemies) {
	  enemies.forEach(function(enemy) {
	    enemy.kill();
	  });
	};
	
	//// RECURSIVE & ITERATIVE CHECK FUNCTIONS / HELPERS
	
	Brood.prototype.livingAliens = function() {
	  for(let i in this.aliens) {
	    if(this.aliens[i].alive) return true;
	  }
	  return false;
	};
	
	Brood.prototype.checkWin = function() {
	  if(!this.livingAliens()) this.win = true;
	};
	
	Brood.prototype.checkLoss = function() {
	  this.aliens.forEach(function(alien) {
	    if(alien.alive &&
	      !alien.staged &&
	      alien.pos[1] > Constants.lossHeight) {
	      this.loss = true;
	    }
	  });
	};
	
	Brood.prototype.getTopRow = function() {
	  let topRow = this.aliens.reduce(function(result, alien) {
	    if(alien.pos[1] === (alien.game.top + RADIUS) &&
	      alien.alive) {
	      result.push(alien);
	    }
	    return result;
	  }, []);
	  // debugger
	  return topRow;
	};
	
	Brood.prototype.getAttached = function() {
	  let topAliens = this.getTopRow();
	  let attached = [];
	  topAliens.forEach(function(alien) {
	    if(attached.includes(alien)) return;
	    let cluster = this.getFullCluster(alien);
	    addNewNodes(attached, cluster);
	  }.bind(this));
	  return attached;
	};
	
	Brood.prototype.getSimilarNeighbors = function(alien) {
	  let similarNeighbors = [];
	  for(let j = 0; j < (this.aliens.length); j++) {
	    if(alien.neighboring(this.aliens[j]) &&
	      alien.type === this.aliens[j].type
	    ) {
	      similarNeighbors.push(this.aliens[j]);
	    }
	  }
	  return similarNeighbors;
	};
	
	Brood.prototype.getSimilarCluster = function(alien, nodeList) {
	  nodeList = nodeList || [];
	  if(!nodeList.includes(alien)) nodeList.push(alien);
	
	  this.getSimilarNeighbors(alien).forEach(function(neighbor) {
	    if(!nodeList.includes(neighbor)) {
	      let newList = this.getSimilarCluster(neighbor, nodeList);
	      return addNewNodes(nodeList, newList);
	    }
	  }.bind(this));
	
	  return nodeList;
	};
	
	Brood.prototype.getAllNeighbors = function(alien) {
	  let allNeighbors = [];
	  for(let j = 0; j < (this.aliens.length); j++) {
	    if(alien.neighboring(this.aliens[j])) {
	      allNeighbors.push(this.aliens[j]);
	    }
	  }
	  return allNeighbors;
	};
	
	Brood.prototype.getFullCluster = function(alien, nodeList) {
	  nodeList = nodeList || [];
	  if(!nodeList.includes(alien)) nodeList.push(alien);
	
	  this.getAllNeighbors(alien).forEach(function(neighbor) {
	    if(!nodeList.includes(neighbor) && neighbor.alive) {
	      let newList = this.getFullCluster(neighbor, nodeList);
	      return addNewNodes(nodeList, newList);
	    }
	  }.bind(this));
	
	  return nodeList;
	};
	
	
	module.exports = Brood;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	const Util = __webpack_require__(5);
	const Game = __webpack_require__(2);
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	
	const RADIUS = Constants.RADIUS;
	const SPEED = Constants.SPEED;
	const XSPACE = Constants.X_SPACING;
	
	const Alien = function(options) {
	  this.id = options.id;
	  this.color = options.color;
	  this.type = options.type;
	  this.radius = options.radius;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.alive = true;
	  this.staged = options.staged;
	  this.game = options.game;
	};
	
	// INSTANCE METHODS
	
	const polygon = function(context, x, y, radius, sides, startAngle, anticlockwise) {
	  if (sides < 3) return;
	  var a = (Math.PI * 2)/sides;
	  a = anticlockwise?-a:a;
	  context.save();
	  context.translate(x,y);
	  context.rotate(startAngle);
	  context.moveTo(radius,0);
	  for (var i = 1; i < sides; i++) {
	    context.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
	  }
	  ctx.stroke();
	  context.closePath();
	  context.restore();
	};
	
	Alien.prototype.draw = function() {
	  if(this.alive) {
	    // polygon(ctx, this.pos[0], this.pos[1], this.radius, 6, Math.PI/2);
	    // ctx.translate(-this.radius, -this.radius);
	    let scalingFactor = 1.5;
	    ctx.drawImage(
	      this.type,
	      this.pos[0]-this.radius / scalingFactor,
	      this.pos[1]-this.radius,
	      scalingFactor * this.radius,
	      1.25 * scalingFactor * this.radius
	    );
	    // ctx.translate(this.radius, this.radius);
	  }
	};
	
	Alien.prototype.move = function() {
	  if(!this.alive) return;
	  let newX = (this.pos[0] + this.vel[0]);
	  let newY = (this.pos[1] + this.vel[1]);
	
	  if(!this.bounded(newX)) {
	    newX -= this.vel[0] * 2;
	    this.vel[0] *= -1;
	  }
	
	  if(newY < this.game.top){
	    // debugger
	    [newX, newY] = this.fixToCeiling(newX);
	  }
	
	  this.pos = [newX, newY];
	  // this.draw();
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
	
	Alien.prototype.setPosition = function(alien, angle) {
	  let radius = this.radius * Math.sqrt(3);
	  let x = alien.pos[0] + radius * Math.cos(angle);
	  let y = alien.pos[1] + radius * Math.sin(angle);
	  this.pos = [x, y];
	};
	
	Alien.prototype.fixToCeiling = function(x) {
	  // debugger
	  this.game.brood.stop(this);
	  let xOffset = this.game.topFlush ? 0 : XSPACE;
	  let deltaX = (x + xOffset) % (2 * XSPACE);
	  let newX = x - deltaX + XSPACE;
	  let newY = this.game.top + RADIUS;
	  // Test if [newX, newY] is occupied
	  let direction;// = this.vel/Math.abs(this.vel);
	
	  // debugger
	  while(this.game.brood.alienAt([newX, newY])) {
	    direction = Math.sign(this.pos[0] - newX);
	    newX += 2 * XSPACE;// * direction;
	  }
	
	  // if it's occupied check right then check left
	
	
	  // const DIAM = 2 * XSPACE;
	  // let effectiveX = x - xOffset;
	  // let xBound = DIAM * Math.round((effectiveX)/(DIAM));
	  // let newX = Constants.X_SPACING + xBound;
	  // checkLoss();
	  return [newX, newY];
	};
	
	Alien.prototype.kill = function() {
	  this.alive = false;
	  this.game.updateScore();
	};
	
	Alien.prototype.touches = function(otherAlien) {
	  res = Alien.hexCompare(
	    this.pos,
	    otherAlien.pos,
	    2 * this.radius,
	    Math.PI / 4
	  );
	  return res;
	};
	
	Alien.prototype.stop = function() {
	  this.vel = [0,0];
	};
	
	Alien.prototype.neighboring = function(neighbor) {
	  res =(
	    this !== neighbor &&
	    this.touches(neighbor) &&
	    neighbor.alive
	  );
	  return res;
	};
	
	///////////////////// REFACTORING - NOT IN USE
	
	const VERTICES = Constants.VERTICES;
	
	const ANGLES = [];
	const getAngles = function(){
	  for(let i = 0; i < VERTICES; i++) {
	    let angle = (i * Math.PI / 3 - Math.PI);
	    ANGLES.push(angle);
	  }
	};
	getAngles();
	
	Alien.prototype.getVertices = function() {
	  return [
	    [this.pos[0], this.pos[1] + RADIUS],
	    [this.pos[0], this.pos[1] - RADIUS],
	    [this.pos[0] + RADIUS * Math.cos(Math.PI/6), this.pos[1] + RADIUS * Math.sin(Math.PI/6)],
	    [this.pos[0] + RADIUS * Math.cos(Math.PI/6), this.pos[1] - RADIUS * Math.sin(Math.PI/6)],
	    [this.pos[0] - RADIUS * Math.cos(Math.PI/6), this.pos[1] + RADIUS * Math.sin(Math.PI/6)],
	    [this.pos[0] - RADIUS * Math.cos(Math.PI/6), this.pos[1] - RADIUS * Math.sin(Math.PI/6)],
	  ];
	};
	
	Alien.prototype.inHexagon = function(pos) {
	  let [x, y] = this.pos;
	  let [a, b] = pos;
	  let radius = this.radius;
	
	  // x = a + ((x - a) * Math.cos(angle) - (y - b) * Math.sin(angle));
	  // y = b + ((y - b) * Math.cos(angle) + (x - a) * Math.sin(angle));
	  //
	  let res = (
	    x <= a + radius * Math.cos(Math.PI/6) &&
	    x >= a - radius * Math.cos(Math.PI/6) &&
	    y - (b + radius) <= (x - a) * Math.tan(Math.PI/6) &&
	    y - (b - radius) >= (x - a) * Math.tan(Math.PI/6) &&
	    y - (b + radius) <= -(x - a) * Math.tan(Math.PI/6) &&
	    y - (b - radius) >= -(x - a) * Math.tan(Math.PI/6)
	  );
	  return res;
	};
	
	Alien.hexCompare = function(posA, posB, radius, angle = 0) {
	  let [x, y] = posA;
	  let [a, b] = posB;
	
	  // x = a + ((x - a) * Math.cos(angle) - (y - b) * Math.sin(angle));
	  // y = b + ((y - b) * Math.cos(angle) + (x - a) * Math.sin(angle));
	  // debugger
	  let res = (
	    y <= b + radius * Math.cos(Math.PI/6) &&
	    y >= b - radius * Math.cos(Math.PI/6) &&
	    x - (a + radius) <= (y - b) * Math.tan(Math.PI/6) &&
	    x - (a - radius) >= (y - b) * Math.tan(Math.PI/6) &&
	    x - (a + radius) <= -(y - b) * Math.tan(Math.PI/6) &&
	    x - (a - radius) >= -(y - b) * Math.tan(Math.PI/6)
	  );
	  return res;
	};
	
	// Alien.hexCompare = function(posA, posB, radius, angle = 0) {
	//
	// };
	
	// Called from perspective of moving alien
	Alien.prototype.angleWith = function(otherAlien) {
	  let y = this.pos[1] - otherAlien.pos[1];
	  let x = this.pos[0] - otherAlien.pos[0];
	  // debugger
	  return Math.atan2(y,x);
	};
	
	Alien.prototype.collidingWith = function(otherAlien) {
	  console.log("colliding?");
	  let vertices = this.getVertices();
	  for(let i = 0; i < vertices.length; i++) {
	    if(otherAlien.inHexagon(vertices[i])){
	      return true;
	    }
	  }
	  return false;
	};
	
	// MAYBE A UTILITY? Returns sorted copy of ANGLES by their difference with input angle
	Alien.sortedAngles = function(angle) {
	  let angles = ANGLES.slice();
	  // debugger
	  angles = angles.sort(function(a, b) {
	    if(Math.abs(a - angle) < Math.abs(b - angle)) {
	      return -1;
	    } else {
	      return 1;
	    }
	  });
	  return angles;
	};
	
	
	//////////////////////////////
	
	module.exports = Alien;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	
	const RADIUS = Constants.RADIUS;
	const COLORS = Constants.COLORS;
	
	var greenAlien = new Image();
	greenAlien.src = "assets/images/aliens/smiley_green_alien.svg";
	var blueAlien = new Image();
	blueAlien.src = "assets/images/aliens/smiley_blue_alien.svg";
	var redAlien = new Image();
	redAlien.src = "assets/images/aliens/smiley_red_alien.svg";
	var orangeAlien = new Image();
	orangeAlien.src = "assets/images/aliens/smiley_orange_alien.svg";
	var purpleAlien = new Image();
	purpleAlien.src = "assets/images/aliens/smiley_purple_alien.svg";
	
	TYPES = [
	  greenAlien,
	  blueAlien,
	  purpleAlien,
	  redAlien,
	  orangeAlien
	];
	
	module.exports = {
	  randomColor: function() {
	    return COLORS[Math.floor(Math.random() * COLORS.length)];
	  },
	
	  randomType: function() {
	    return TYPES[Math.floor(Math.random() * TYPES.length)];
	  },
	
	  randomVelocity: function() {
	    let x = Math.random() * 2 - 1;
	    let y = Math.random() * 2 - 1;
	    let speed = Math.random();
	    x = x / Math.sqrt(x * x + y * y);
	    y = y / Math.sqrt(x * x + y * y);
	    return [x, y];
	  },
	
	  getVelocity: function(vector){
	    let x = vector[0];
	    let y = vector[1];
	    let result = [
	      x/Math.sqrt(x * x + y * y),
	      y/Math.sqrt(x * x + y * y)
	    ];
	    return result;
	  },
	
	  xDist: function(first, second) {
	    return Math.abs(first[0] - second[0]);
	  },
	
	  yDist: function(first, second) {
	    return Math.abs(first[1] - second[1]);
	  },
	
	  onCanvas: function(pos) {
	    return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
	  },
	
	  inRange: function(posA, posB) {
	    return (
	      this.xDist(posA, posB) < Constants.RADIUS * 0.01 &&
	      this.yDist(posA, posB) < Constants.RADIUS * 0.01
	    );
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	const Brood = __webpack_require__(3);
	const Game = __webpack_require__(2);
	
	const canvas = document.getElementById("brood-canvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();
	img.src = 'assets/images/cannon.png';
	let DELTA = Constants.DELTA;
	let RADIUS = Constants.RADIUS;
	
	const Cannon = function() {
	  this.color = "#d3d3d3";
	  this.length = canvas.height/5;
	  this.width = RADIUS * 2.5;
	  this.angle = 0;
	  this.spaceDown = false;
	  this.stagedAlien = null;
	  this.direction = null;
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
	
	Cannon.prototype.rotate = function() {
	  if(this.direction === "right" &&
	    this.angle < 5*Math.PI/12
	  ) {
	    this.angle += DELTA;
	  }
	  if(this.direction === "left" &&
	    this.angle > - 5*Math.PI/12
	) {
	    this.angle -= DELTA;
	  }
	};
	
	module.exports = Cannon;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map