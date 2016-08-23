const Constants = require('./constants.js');
const Alien = require('./alien.js');
const Util = require('./util.js');

var canvas = document.getElementById("brood-canvas");
let scoreReport = document.getElementById('player-score');
var ctx = canvas.getContext("2d");

const RADIUS = Constants.RADIUS;
const SPEED = Constants.SPEED;


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

const xDist = function(first, second) {
  return Math.abs(first.pos[0] - second.pos[0]);
};

const yDist = function(first, second) {
  return Math.abs(first.pos[1] - second.pos[1]);
};

const onCanvas = function(pos) {
  return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
};

var shotCount = 0;
var score = 0;
var aliens = [];
var topFlush = true;
var top = 0;
var lossHeight = canvas.height * 3 / 4;

const Brood = function() {
  this.loss =  false;
  this.win = true;
};

initializeAliens = function() {
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
  // debugger
};

Brood.reset = function() {
  aliens = [];
  top = 0;
  this.loss = false;
  this.win = false;
  score = 0;
  shotCount = 0;
  initializeAliens();
};

Brood.renderAliens = function() {
  moveAliens();
  findCollisions();
  // Alien.drawCeiling();
};

const findCollisions = function() {
  for(let i = 0; i < (aliens.length); i++) {
    for(let j = 0; j < (aliens.length); j++) {
      if(i != j && aliens[i].alive && aliens[j].alive){
        if (aliens[i].checkCollision(aliens[j])){
          lock(aliens[i], aliens[j]);
          markKills(aliens[i], aliens);
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

const killAliens = function(enemies) {
  enemies.forEach(function(enemy) {
    enemy.alive = false;
    score += Constants.POINTS;
  });
  updateScore();
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

// GAME LOGIC
const resetTop = function() {
  top += 2 * RADIUS;
  aliens.forEach(function(alien){
    alien.pos[1] += 2* RADIUS;
  });
};

// GAME LOGIC
const countShots = function() {
  shotCount += 1;
  console.log(shotCount);
  if(shotCount % 10 === 0) resetTop();
};

// GAME LOGIC
const updateScore = function() {
  scoreReport.textContent = `Your score: ${score}`;
};

// WHERE IS THIS CALLED?
Brood.livingAliens = function() {
  let living = aliens.reduce(function(result, alien) {
    if(alien.alive) result.push(alien); return result;
  }, []);
  return living;
};

markKills = function(alien) {
  let neighbors = getSimilarCluster(alien);
  if(neighbors.length >2){
    killAliens(neighbors);
    killUnattached();
    checkWin();
  }
};

killUnattached = function() {
  let attached = Brood.getAttached();
  aliens.forEach(function(alien){
    if(
      !attached.includes(alien) &&
      !alien.staged &&
      !alien.isMoving()
    ) alien.alive = false;
  });
};

moveAliens = function() {
  aliens.forEach(function(invader) {
    invader.move();
    markKills(invader);
  });
};

const lock = function(alien, otherAlien) {
  let pos = [];
  let x_dist = Math.abs(alien.pos[0] - otherAlien.pos[0]);
  let y_dist = Math.abs(alien.pos[1] - otherAlien.pos[1]);
  let maj_axis = y_dist > x_dist ? 0 : 1;
  let min_axis = y_dist > x_dist ? 1 : 0;
  axial_dist = Math.abs(alien.pos[maj_axis] - otherAlien.pos[maj_axis]);

  pos[1] = otherAlien.pos[1];
  let x_offset = (alien.pos[0] > otherAlien.pos[0]) ? 2 * RADIUS : -2 * RADIUS;
  pos[0] = otherAlien.pos[0] + x_offset;

  if(maj_axis === 0 || !spaceOccupied(pos)) {
    pos[1] = otherAlien.pos[1] + 2 * RADIUS;
    let x_offset = (alien.pos[0] > otherAlien.pos[0]) ? RADIUS : -RADIUS;
    pos[0] = otherAlien.pos[0] + x_offset;
    if(!Util.onCanvas(pos)) pos[0] += 2 * x_offset;
  }
  alien.pos = pos;
  alien.stop();
  // checkLoss();
};

const livingAliens = function() {
  for(let i in aliens) {
    if(aliens[i].alive) return true;
  }
  return false;
};

const checkWin = function() {
  if(!livingAliens()) this.win = true;
};

const checkLoss = function() {
  aliens.forEach(function(alien) {
    if(alien.alive &&
      !alien.isMoving() &&
      !alien.staged &&
      alien.pos[1] > lossHeight) {
      this.loss = true;
    }
  });
};

getSimilarNeighbors = function(alien) {
  let similarNeighbors = [];
  for(let j = 0; j < (aliens.length); j++) {
    if(alien.neighboring(aliens[j]) &&
      alien.type === aliens[j].type
    ) {
      similarNeighbors.push(aliens[j]);
    }
  }
  return similarNeighbors;
};

getAllNeighbors = function(alien) {
  let allNeighbors = [];
  for(let j = 0; j < (aliens.length); j++) {
    if(alien.neighboring(aliens[j])) {
      allNeighbors.push(aliens[j]);
    }
  }
  return allNeighbors;
};


getSimilarCluster = function(alien, nodeList) {
  nodeList = nodeList || [];
  if(!nodeList.includes(alien)) nodeList.push(alien);

  getSimilarNeighbors(alien).forEach(function(neighbor) {
    if(!nodeList.includes(neighbor)) {
      // debugger
      let newList = getSimilarCluster(neighbor, nodeList);
      return addNewNodes(nodeList, newList);
    }
  });

  return nodeList;
};

getFullCluster = function(alien, nodeList) {
  nodeList = nodeList || [];
  if(!nodeList.includes(alien)) nodeList.push(alien);

  getAllNeighbors(alien).forEach(function(neighbor) {
    if(!nodeList.includes(neighbor) && neighbor.alive) {
      let newList = getFullCluster(alien, nodeList);
      return addNewNodes(nodeList, newList);
    }
  });

  return nodeList;
};


Brood.stageAlien = function(){
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

Brood.fireCannon = function(angle, alien) {
  alien.vel = [
    SPEED * Math.sin(angle),
    -SPEED * Math.cos(angle)
  ];
  alien.staged = false;
  countShots();
};

module.exports = Brood;
