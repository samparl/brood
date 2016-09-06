const Constants = require('./constants.js');
const Alien = require('./alien.js');
const Util = require('./util.js');

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
    let height = RADIUS + level * RADIUS * (1 + Math.sin(Math.PI/6));
    let x = xSpacing * 1.5 + (level % 2) * xSpacing;
    while(x + xSpacing < canvas.width) {
      let alien = Alien.createAlien(x, height, game, false);
      hash[alien.id] = alien;
      x += 2 * xSpacing;
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
  this.moveAliens();
  this.checkAllCollisions();
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
  for(let id in this.hangingAliens) {
    this.hangingAliens[id].draw();
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
  for(let id in this.hangingAliens) {
    if(alien.collidingWith(this.hangingAliens[id])) {
      let angle = this.findAngle(alien, this.hangingAliens[id]);
      alien.setPosition(this.hangingAliens[id], angle);
      this.stop(alien);
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
  this.markKills(alien);
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
  return Object.keys(this.hangingAliens).length === 0 ? false : true;
};

Brood.prototype.checkWin = function() {
  if(!this.livingAliens()) this.game.win = true;
};

Brood.prototype.checkLoss = function() {
  for(let i in this.hangingAliens) {
    let alien = this.hangingAliens[i];
    if(alien.pos[1] + this.game.top > Constants.LOSSHEIGHT) {
      this.game.loss = true;
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
