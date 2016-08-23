const Constants = require('./constants.js');
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
var lossHeight = canvas.height * 3 / 4;
let loss = false;
let win = false;

const COLORS = [
    "blue",
    "red",
    "yellow"
];

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

var coolAlien = new Image();
coolAlien.src = "assets/images/aliens/green/Smiley_green_alien_big_eyes.svg";

const randomColor = function() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

const randomType = function() {
  return TYPES[Math.floor(Math.random() * TYPES.length)];
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
  this.type = options.type;
  this.radius = options.radius;
  this.pos = options.pos;
  this.vel = options.vel;
  this.alive = true;
  this.staged = options.staged;
};

// CLASS METHODS

Alien.loss = function(){
  return loss;
};

Alien.win = function() {
  return win;
};

Alien.drawCeiling = function() {
  ctx.beginPath();
  ctx.fillStyle = "#d3d3d3";
  ctx.rect(0,0,canvas.width, top);
  ctx.fill();
  ctx.closePath();
};

Alien.initializeAliens = function() {
  for(let level = 0; level < Constants.NUMROWS; level++){
    let pos = RADIUS + (level % 2) * RADIUS;
    while(pos < canvas.width) {
      let height = RADIUS + level * 2 * RADIUS;
      let options = {
        pos: [pos, height],
        vel: [0,0],
        color: randomColor(),
        type: randomType(),
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
    if(alien.pos[1] === (top + RADIUS) &&
      alien.alive) {
      result.push(alien);
    }
    return result;
  }, []);
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
  console.log(shotCount);
  if(shotCount % 10 === 0) resetTop();
};

Alien.reset = function() {
  aliens = [];
  top = 0;
  loss = false;
  win = false;
  score = 0;
  shotCount = 0;
  Alien.initializeAliens();
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
  if(!livingAliens()) win = true;
};

const checkLoss = function() {
  aliens.forEach(function(alien) {
    if(alien.alive &&
      !alien.isMoving() &&
      !alien.staged &&
      alien.pos[1] > lossHeight) {
      loss = true;
    }
  });
};

Alien.stageAlien = function(){
  let options = {
    pos: [canvas.width/2, canvas.height - Constants.RADIUS],
    vel: [0, 0],
    color: randomColor(),
    type: randomType(),
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
  ctx.translate(-this.radius, -this.radius);
  ctx.drawImage(this.type, this.pos[0], this.pos[1], 2 * this.radius, 2.5 * this.radius);
  ctx.translate(this.radius, this.radius);
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
  this.markKills();
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

Alien.prototype.touches = function(otherAlien) {
  let x_dist = xDist(this, otherAlien);
  let y_dist = yDist(this, otherAlien);
  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
    return true;
  } else {
    return false;
  }
};

///////////////////// REFACTORING - NOT IN USE
const VERTICES = Constants.VERTICES;

const ANGLES = [];
const getAngles = function(){
  for(let i = 1; i <= VERTICES; i++) {
    let angle = (2 * Math.PI / i);
    ANGLES.push(angle);
  }
};
getAngles();

this.inHexagon = function(pos) {
  let [x, y] = pos;
  let [a, b] = this.pos;

  if(x <= a + RADIUS * Math.cos(30) && x <= a + RADIUS * Math.cos(30) &&
    y <= x * Math.tan(Math.PI/6) + b + RADIUS + a * Math.tan(Math.PI/6) &&
    y >= x * Math.tan(Math.PI/6) + b - RADIUS - a * Math.tan(Math.PI/6) &&
    y <= -x * Math.tan(Math.PI/6) + b + RADIUS + a * Math.tan(Math.PI/6) &&
    y >= -x * Math.tan(Math.PI/6) + b - RADIUS - a * Math.tan(Math.PI/6)
  ) {
    return true;
  } else {
    return false;
  }
};

this.collidingWith = function(otherAlien) {
  let vertices = [];
  for(let i = 0; i < vertices.length; i++) {
    if(otherAlien.inHexagon(vertices[i])){
      return this.lockPosition(otherAlien); // DEFINE THIS FUNCTION
    }
  }
};

this.lockPosition = function(otherAlien) {

};

//////////////////////////////

Alien.prototype.fixToCeiling = function(x) {
  this.stop();
  const DIAM = 2 * RADIUS;
  let xOffset = topFlush ? 0 : RADIUS;
  let effectiveX = x - xOffset;
  let xBound = DIAM * Math.round((effectiveX)/(DIAM));
  let newY = top + RADIUS;
  let newX = RADIUS + xBound;
  checkLoss();
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
      this.type === aliens[j].type
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
    this.touches(neighbor) &&
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
  checkLoss();
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
  // let x_dist = xDist(this, otherAlien);
  // let y_dist = yDist(this, otherAlien);
  if (this.touches(otherAlien)) {
    return this.isMoving() ? true : false;
  }
};


module.exports = Alien;
