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
