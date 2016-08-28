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
	
	window.currentGame = game;
	
	$("#view-style").click(function() {
	  window.currentGame.skeleton = !window.currentGame.skeleton;
	});
	
	game.setup();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var canvas = document.getElementById("brood-canvas");
	
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
	let radius = 40;
	let spacing = radius * Math.sqrt(3) / 2;
	let xValues = [];
	
	let idx = 1.5 * spacing;
	while(idx + spacing < canvas.width) {
	  xValues.push(idx);
	  idx += (2 * spacing);
	}
	
	const Constants = {
	  NUMROWS: 1,
	  LOSSHEIGHT: canvas.height * 0.5,
	  RADIUS: radius,
	  X_SPACING: spacing,
	  HORIZONTALS: xValues,
	  VERTICES: 6,
	  DELTA: 0.05,
	  SPEED: 10,
	  POINTS: 10,
	  RICHOCHET_POINTS: 5,
	  COLORS: [
	      "green",
	      "blue",
	      "purple",
	      "red",
	      "orange"
	  ],
	  TYPES: [
	    greenAlien,
	    blueAlien,
	    purpleAlien,
	    redAlien,
	    orangeAlien
	  ]
	};
	
	module.exports = Constants;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	const Brood = __webpack_require__(3);
	const Cannon = __webpack_require__(6);
	
	const SPEED = Constants.SPEED;
	const RADIUS = Constants.RADIUS;
	
	var playFrame = $("#play");
	let scoreReport = document.getElementById('round-score');
	let totalReport = document.getElementById('total-score');
	var canvas = document.getElementById("brood-canvas");
	var ctx = canvas.getContext("2d");
	var gameInterval;
	var totalScore = 0;
	
	let canvasBackground = ctx.createLinearGradient(canvas.height, 0, canvas.height, canvas.width);
	canvasBackground.addColorStop(1, "#f44336");
	canvasBackground.addColorStop(0.6, "#2196f3");
	
	let nightSky = ctx.createLinearGradient(canvas.height, 0, canvas.height, canvas.width);
	nightSky.addColorStop(0, "#000");
	nightSky.addColorStop(0.9, "#2196f3");
	
	const Game = function(options) {
	  window.currentGame = this;
	  this.top = 0;
	  this.shotCount = 0;
	  this.score = 0;
	  this.topFlush = true;
	  this.brood = new Brood({game: this});
	  this.cannon = new Cannon();
	  this.skeleton = false;
	};
	
	//////// GAMEPLAY
	
	Game.prototype.step = function() {
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  this.drawBackground();
	  this.brood.stepAliens();
	  if(this.brood.loss) {
	    this.end("You lose!");
	    totalScore = 0;
	  } else if(this.brood.win){
	    totalScore += this.score;
	    this.end("You win!");
	  }
	};
	
	Game.prototype.updateScore = function() {
	  this.score += Constants.POINTS;
	  scoreReport.textContent = this.score;
	};
	
	Game.prototype.richochet = function() {
	  this.score += Constants.RICHOCHET_POINTS;
	  scoreReport.textContent = this.score;
	};
	
	Game.prototype.countShots = function() {
	  this.shotCount += 1;
	  if(this.shotCount % 15 === 0) this.resetTop();
	};
	
	Game.prototype.resetTop = function() {
	  this.top += 2 * RADIUS;
	};
	
	Game.prototype.drawBackground = function() {
	  let canvasBackground = ctx.createLinearGradient(this.top, this.top, this.top, canvas.height);
	  canvasBackground.addColorStop(1, "#f44336");
	  canvasBackground.addColorStop(0.6, "#2196f3");
	
	  let nightSky = ctx.createLinearGradient(0, this.top, 0, 0);
	  nightSky.addColorStop(1, "#000");
	  nightSky.addColorStop(0.01, "#2196f3");
	
	  ctx.fillStyle = canvasBackground;
	  if(this.skeleton) {
	    this.drawCeiling();
	  } else {
	    ctx.fillRect(0, this.top, canvas.width, canvas.height);
	    ctx.fillStyle = nightSky;
	    ctx.fillRect(0, 0, canvas.width, this.top);
	    this.drawBuildings();
	  }
	};
	
	Game.prototype.drawCeiling = function() {
	  ctx.beginPath();
	  ctx.fillStyle = "#d3d3d3";
	  ctx.rect(0,0,canvas.width, this.top);
	  ctx.fill();
	  ctx.closePath();
	};
	
	Game.prototype.drawBuildings = function() {
	
	};
	
	//////// START/STOP PLAY METHODS
	
	Game.prototype.setup = function() {
	  scoreReport.textContent = this.score;
	  $replay.remove();
	  gameInterval = setInterval(this.step.bind(this), 10);
	  var event = new CustomEvent('imagesLoaded');
	  var keydownEvent = document.addEventListener('keydown', this.onKeyDown.bind(this));
	  var keyupEvent = document.addEventListener('keyup', this.onKeyUp.bind(this));
	};
	
	Game.prototype.end = function(text) {
	  document.removeEventListener('keydown', this.onKeyDown.bind(this));
	  document.removeEventListener('keyup', this.onKeyUp.bind(this));
	  clearInterval(gameInterval);
	  $replay.text(`${ text } Play again?`);
	  $replay.append('<i class="fa fa-refresh" aria-hidden="true"></i>');
	  $replay.on("click", ".fa-refresh", playAgain);
	  playFrame.append($replay);
	  totalReport.textContent = totalScore;
	};
	
	const playAgain = function() {
	  let game = new Game();
	  game.setup();
	};
	
	//////// LISTENERS AND THEIR CALLBACKS
	
	Game.prototype.onKeyDown = function(e) {
	  if(e.keyCode === 39) {
	    this.cannon.direction = "right";
	  } else if(e.keyCode === 37) {
	    this.cannon.direction = "left";
	  } else if(e.keyCode === 32) {
	    e.preventDefault();
	    if(!this.cannon.spaceDown) {
	      this.countShots();
	      this.brood.stageAlien();
	    }
	    this.cannon.spaceDown = true;
	  }
	};
	
	Game.prototype.onKeyUp = function(e) {
	  this.cannon.direction = null;
	  this.cannon.spaceDown = false;
	  if(e.keyCode === 32) {
	    let alien = this.brood.stagedAliens.pop();
	    this.brood.movingAliens[alien.id] = alien;
	    this.fireCannon(this.cannon.angle, alien);
	  }
	};
	
	Game.prototype.fireCannon = function(angle, alien) {
	  alien.vel = [
	    SPEED * Math.sin(angle),
	    -SPEED * Math.cos(angle)
	  ];
	  alien.pos[1] -= this.top;
	  alien.staged = false;
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
	  let stagedAlien = Alien.createAlien(
	    Constants.RADIUS * 2.5,
	    canvas.height - Constants.RADIUS * 2.5,
	    options.game,
	    true);
	  let aliens = initializeAliens(options.game);
	  this.game = options.game;
	  this.stagedAliens = [stagedAlien];
	  this.movingAliens = {};
	  this.hangingAliens = aliens;
	  this.staticAliens = {};
	  this.deadAliens = {};
	  this.shotCount = 1;
	};
	
	initializeAliens = function(game) {
	  let xValues = Constants.HORIZONTALS;
	
	  let hash = {};
	  for(let level = 0; level < Constants.NUMROWS; level++) {
	    let height = RADIUS + level * 2 * RADIUS;
	    for(let idx in xValues){
	      let alien = Alien.createAlien(xValues[idx], height, game, false);
	      hash[alien.id] = alien;
	      idx += 2 * xSpacing;
	    }
	  }
	
	  return hash;
	};
	
	Brood.prototype.stageAlien = function(){
	  let newAlien = Alien.createAlien(
	    Constants.RADIUS * 2.5,
	    canvas.height - Constants.RADIUS * 2.5,
	    this.game,
	    true
	  );
	  this.stagedAliens[0].pos = [
	    canvas.width/2,
	    canvas.height - Constants.RADIUS
	  ];
	  this.stagedAliens.unshift(newAlien);
	  return newAlien;
	};
	
	Brood.prototype.stepAliens = function() {
	  this.checkAllCollisions();
	  this.moveAliens();
	  this.renderAliens();
	  this.game.cannon.rotate();
	  this.game.cannon.draw();
	  this.renderStagedAliens();
	  this.checkLoss();
	};
	
	Brood.prototype.moveAliens = function() {
	  for(let id in this.movingAliens){
	    let alien = this.movingAliens[id];
	    alien.move();
	  }
	};
	
	Brood.prototype.renderAliens = function() {
	  this.renderMovingAliens();
	  this.renderHangingAliens();
	  this.dropDeadAliens();
	};
	
	Brood.prototype.renderStagedAliens = function() {
	  let displayNext = this.stagedAliens[0];
	  let circleOptions = {lineWidth: 10, fillStyle: "white"};
	  displayNext.circle(displayNext.radius * 2, circleOptions);
	
	  for(let i in this.stagedAliens) {
	    this.stagedAliens[i].draw();
	  }
	};
	
	Brood.prototype.renderMovingAliens = function() {
	  for(let id in this.movingAliens) {
	    this.movingAliens[id].draw();
	  }
	};
	
	Brood.prototype.renderHangingAliens = function() {
	  for(let i in this.hangingAliens) {
	    this.hangingAliens[i].draw();
	  }
	};
	
	Brood.prototype.dropDeadAliens = function() {
	  for(let id in this.deadAliens) {
	    this.deadAliens[id].dropAlien();
	  }
	};
	
	Brood.prototype.checkAllCollisions = function() {
	  for(let id in this.movingAliens) {
	    this.checkAlienCollisions(this.movingAliens[id]);
	  }
	};
	
	Brood.prototype.checkAlienCollisions = function(alien) {
	  for(let i in this.hangingAliens) {
	    if(alien.collidingWith(this.hangingAliens[i])) {
	      let angle = this.findAngle(alien, this.hangingAliens[i]);
	      // console.log(`position angle will be ${angle * 360/(2*Math.PI)}`);
	      alien.setPosition(this.hangingAliens[i], angle);
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
	  return angle;
	};
	
	// Test positions at different angles around an alien
	Brood.prototype.isOccupied = function(alien, angle) {
	  let pos = [
	    alien.pos[0] + 2 * RADIUS * Math.cos(angle),
	    alien.pos[1] + 2 * RADIUS * Math.sin(angle)
	  ];
	
	  for(let i in this.hangingAliens) {
	    if(Util.inRange(pos, this.hangingAliens[i].pos)){
	      return true;
	    }
	  }
	
	  return false;
	};
	
	// Test if a specific location is occupied
	Brood.prototype.alienAt = function(pos) {
	  for(let i in this.hangingAliens) {
	    if(this.hangingAliens[i].alive &&
	      Util.inRange(pos, this.hangingAliens[i].pos)) {
	      return true;
	    }
	  }
	
	  return false;
	};
	
	// Set velocity to zero and move from moving to static hash
	Brood.prototype.stop = function(alien){
	  alien.stop();
	  delete this.movingAliens[alien.id];
	  this.hangingAliens[alien.id] = alien;
	};
	
	////////// UTILITY FUNCTIONS
	
	const addNewNodes = function(oldNodes, newNodes) {
	  newNodes.forEach(function(node) {
	    if(!oldNodes.includes(node)) oldNodes.push(node);
	  });
	};
	
	////////////// KILL FUNCTIONS
	
	Brood.prototype.markKills = function(alien) {
	  let neighbors = this.getSimilarCluster(alien);
	  // console.log(neighbors);
	  if(neighbors.length > 2){
	    this.killAliens(neighbors);
	    this.killUnattached();
	    this.checkWin();
	  }
	};
	
	Brood.prototype.killUnattached = function() {
	  let attached = this.getAttached();
	
	  for(let i in this.hangingAliens) {
	    let alien = this.hangingAliens[i];
	    if( !attached.includes(alien) &&
	        !alien.staged
	    ) alien.kill();
	  }
	};
	
	Brood.prototype.killAliens = function(enemies) {
	  enemies.forEach(function(enemy) {
	    enemy.kill();
	  });
	};
	
	//// GAME CHECK FUNCTIONS
	
	Brood.prototype.livingAliens = function() {
	  // for(let i in this.hangingAliens) {
	  //   if(this.hangingAliens[i].alive) return true;
	  // }
	  //
	  // return false;
	
	  return Object.keys(this.hangingAliens).length === 0 ? false : true;
	};
	
	Brood.prototype.checkWin = function() {
	  if(!this.livingAliens()) this.win = true;
	};
	
	Brood.prototype.checkLoss = function() {
	  for(let i in this.hangingAliens) {
	    let alien = this.hangingAliens[i];
	    if(alien.pos[1] + this.game.top > Constants.LOSSHEIGHT) {
	      this.loss = true;
	    }
	  }
	
	};
	
	////// NEIGHBOR CHECK FUNCTIONS
	
	Brood.prototype.hangingPositions = function() {
	  let result = [];
	  for(let i in this.hangingAliens) {
	    result.push(this.hangingAliens[i].pos);
	  }
	  return result;
	};
	
	Brood.prototype.getTopRow = function() {
	  let result = [];
	  for(let i in this.hangingAliens) {
	    let alien = this.hangingAliens[i];
	    if(alien.pos[1] === RADIUS &&
	
	    // if(alien.pos[1] === (alien.game.top + RADIUS) &&
	      alien.alive) {
	      result.push(alien);
	    }
	  }
	
	  return result;
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
	
	  for(let i in this.hangingAliens) {
	    let otherAlien = this.hangingAliens[i];
	    if(alien.neighboring(otherAlien) &&
	      alien.type === otherAlien.type
	    ) {
	      similarNeighbors.push(otherAlien);
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
	
	  for(let i in this.hangingAliens) {
	    let otherAlien = this.hangingAliens[i];
	    if(alien.neighboring(otherAlien)) {
	      allNeighbors.push(otherAlien);
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
	
	var nextId = 1;
	const Alien = function(options) {
	  this.color = options.color;
	  this.type = options.type;
	  this.radius = options.radius;
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.alive = true;
	  this.staged = options.staged;
	  this.game = options.game;
	  this.id = nextId++;
	};
	
	Alien.createAlien = function(x, y, game, staged) {
	  let typeColor = Util.randomTypeColor();
	  let options = {
	    pos: [x, y],
	    vel: [0, 0],
	    type: typeColor[0],
	    color: typeColor[1],
	    radius: RADIUS,
	    staged: staged,
	    alive: true,
	    game: game
	  };
	  return new Alien(options);
	};
	
	// INSTANCE METHODS
	Alien.prototype.polygon = function(radius, options) {
	  if (options.sides < 3) return;
	  var a = (Math.PI * 2)/options.sides;
	  a = options.anticlockwise ? -a : a;
	  ctx.beginPath();
	  ctx.save();
	  ctx.translate(this.pos[0], this.pos[1]);
	  ctx.rotate(Math.PI / 2);
	  ctx.moveTo(radius,0);
	  for (var i = 1; i <= options.sides; i++) {
	    ctx.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
	  }
	  ctx.lineWidth = options.lineWidth || 1;
	  ctx.strokeStyle = this.color;
	  ctx.stroke();
	  ctx.closePath();
	  ctx.restore();
	  ctx.closePath();
	};
	
	Alien.prototype.circle = function(radius, options) {
	  ctx.beginPath();
	  ctx.save();
	  ctx.translate(this.pos[0], this.pos[1]);
	  ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
	  ctx.strokeStyle = options.color || "black";
	  ctx.lineWidth = options.lineWidth || 1;
	  if(options.fillStyle) {
	    ctx.fillStyle = options.fillStyle;
	    ctx.fill();
	  }
	  ctx.stroke();
	  ctx.closePath();
	  ctx.restore();
	  ctx.closePath();
	};
	
	Alien.prototype.draw = function() {
	  if(this.game.skeleton) {
	    let options = {
	      color: this.color,
	      lineWidth: 4,
	      sides: 6
	    };
	    this.polygon(this.radius, options);
	    this.circle(Constants.X_SPACING, options);
	  } else {
	    // ctx.translate(-this.radius, -this.radius);
	    let scalingFactor = 1.5,
	    canvasX = this.pos[0]-this.radius / scalingFactor,
	    canvasY = this.pos[1]-this.radius,
	    stretchX = scalingFactor * this.radius,
	    stretchY = 1.25 * scalingFactor * this.radius;
	    if(!this.game.brood.stagedAliens.includes(this)) {
	      canvasY += this.game.top;
	    }
	
	    ctx.drawImage(
	      this.type,
	      canvasX,
	      canvasY,
	      stretchX,
	      stretchY
	    );
	  }
	
	  // ctx.translate(this.radius, this.radius);
	};
	
	Alien.prototype.dropAlien = function() {
	  if(this.pos[1] - RADIUS < canvas.height){
	    this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
	    this.draw();
	  }
	};
	
	Alien.prototype.move = function() {
	  if(!this.alive) return;
	  let newX = (this.pos[0] + this.vel[0]);
	  let newY = (this.pos[1] + this.vel[1]);
	
	  if(!this.bounded(newX)) {
	    newX -= this.vel[0] * 2;
	    this.vel[0] *= -1;
	    this.game.richochet();
	  }
	
	  if(newY - this.radius < 0){
	    [newX, newY] = this.fixToCeiling(newX);
	  }
	
	  this.pos = [newX, newY];
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
	  this.game.brood.stop(this);
	  let newX = Util.closestX(x);
	  let newY = RADIUS;
	  return([newX, newY]);
	};
	
	Alien.prototype.checkPosition = function([x, y]) {
	  while(this.game.brood.alienAt([ x, y])) {
	    let direction = Math.sign(this.pos[0] - x);
	    x += 2 * XSPACE;// * direction;
	  }
	  return [x, y];
	};
	
	Alien.prototype.setPosition = function(alien, angle) {
	  let radius = this.radius * Math.sqrt(3);
	  let x = alien.pos[0] + radius * Math.cos(angle);
	  let y = alien.pos[1] + radius * Math.sin(angle);
	  this.pos = [x, y];
	};
	
	Alien.prototype.kill = function() {
	  // debugger
	  this.alive = false;
	  this.vel[1] = SPEED/2;
	  delete this.game.brood.hangingAliens[this.id];
	  this.game.brood.deadAliens[this.id] = this;
	  this.game.updateScore();
	};
	
	Alien.prototype.neighboring = function(neighbor) {
	  res =(
	    this !== neighbor &&
	    this.touches(neighbor) &&
	    neighbor.alive
	  );
	  return res;
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
	
	// Called from perspective of moving alien
	Alien.prototype.angleWith = function(otherAlien) {
	  let y = this.pos[1] - otherAlien.pos[1];
	  let x = this.pos[0] - otherAlien.pos[0];
	  let angle = Math.atan2(y,x);
	  // console.log(`impact angle is ${angle * 360 / (2 * Math.PI)}`);
	  return angle;
	};
	
	Alien.prototype.collidingWith = function(otherAlien) {
	  // let vertices = this.getVertices();
	  // for(let i = 0; i < vertices.length; i++) {
	  //   if(otherAlien.inHexagon(vertices[i])){
	  //     return true;
	  //   }
	  // }
	  // return false;
	  let potentialPos = [
	    this.pos[0] + this.vel[0],
	    this.pos[1] + this.vel[1]
	  ];
	  let distance = Util.dist(potentialPos, otherAlien.pos);
	  return(distance < this.radius);
	
	};
	
	// MAYBE A UTILITY? Returns sorted copy of ANGLES by their difference with input angle
	Alien.sortedAngles = function(angle) {
	  let angles = ANGLES.slice();
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
	const HORIZONTALS = Constants.HORIZONTALS;
	
	module.exports = {
	  randomColor: function() {
	    return COLORS[Math.floor(Math.random() * COLORS.length)];
	  },
	
	  randomType: function() {
	    return Constants.TYPES[Math.floor(Math.random() * Constants.TYPES.length)];
	  },
	
	  randomTypeColor: function() {
	    let index = Math.floor(Math.random() * Constants.TYPES.length);
	    return([Constants.TYPES[index], Constants.COLORS[index]]);
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
	
	  closestX: function(x) {
	    let res = 0;
	    for(let i in HORIZONTALS) {
	      // debugger
	      if(Math.abs(HORIZONTALS[i] - x) < Math.abs(x - res)){
	        res = HORIZONTALS[i];
	      }
	    }
	    return res;
	  },
	
	  xDist: function(first, second) {
	    return Math.abs(first[0] - second[0]);
	  },
	
	  yDist: function(first, second) {
	    return Math.abs(first[1] - second[1]);
	  },
	
	  dist: function(posA, posB) {
	    return Math.sqrt(
	      this.xDist(posA, posB) * this.xDist(posA, posB) +
	      this.yDist(posA, posB) * this.yDist(posA, posB)
	    );
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
	const cannon = new Image();
	cannon.src = 'assets/images/cannon_straight.png';
	let cannonHeight;
	let cannonWidth;
	cannon.onload = function() {
	  cannonWidth = cannon.width;
	  cannonHeight = cannon.height;
	  // debugger
	}.bind(this);
	
	let DELTA = Constants.DELTA;
	let RADIUS = Constants.RADIUS;
	// debugger
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
	
	  ctx.translate(canvas.width/2, canvas.height - RADIUS);
	  ctx.rotate(-Math.PI/2 + this.angle);
	  ctx.translate(0, -2 * RADIUS);
	  ctx.drawImage(cannon, 0, 0, RADIUS * 5, RADIUS * 4);
	  ctx.translate(0, 2 * RADIUS);
	  ctx.rotate(Math.PI/2 - this.angle);
	  ctx.translate(-canvas.width/2, -canvas.height + RADIUS);
	
	
	  ctx.translate(canvas.width/2, canvas.height);
	  ctx.beginPath();
	  ctx.arc(0, -RADIUS, RADIUS*1.5, 0, Math.PI, true);
	  ctx.rect(-1.5 * RADIUS, -RADIUS, RADIUS * 3, RADIUS);
	  ctx.fillStyle = '#3a3a3a';
	  ctx.fill();
	  ctx.closePath();
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