const Constants = require('./constants.js');
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

const RADIUS = Constants.RADIUS;
const SPEED = Constants.SPEED;
var aliens = [];
var topFlush = true;

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
};

// CLASS METHODS

Alien.initializeAliens = function() {
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

Alien.checkCollisions = function() {
  for(let i = 0; i < (aliens.length); i++) {
    for(let j = 0; j < (aliens.length); j++) {
      if(i != j && aliens[i].alive && aliens[j].alive){
        // if(!aliens[i]) debugger
        aliens[i].stopIfCollidingWith(aliens[j]);
      }
    }
  }
};

const addNewNodes = function(oldNodes, newNodes) {
  newNodes.forEach(function(node) {
    if(!oldNodes.includes(node)) oldNodes.push(node);
  });
};

const onCanvas = function(pos) {
  return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
};


const compareIndex = function(first, second) {
  return(aliens.indexOf(first) - aliens.indexOf(second));
};

const killAliens = function(enemies) {
  // enemies.sort(compareIndex);
  // debugger
  let survivors = [];
  // aliens.forEach(function(alien) {
  //   if(!enemies.includes(alien)) survivors.push(alien);
  // });
  // aliens = survivors;
  enemies.forEach(function(enemy) {
    enemy.alive = false;
    // for(let i = enemies.length; i >= 0; i--) {
    //   let idx = aliens.indexOf(enemy);
    //   aliens.splice(idx, 1);
    // }
  });
};

const spaceOccupied = function(pos) {
  aliens.forEach(function(alien) {
    if(alien.pos === pos && alien.alive) return true;
  });
  return false;
};

Alien.killUnattached = function() {
  aliens.forEach(function(alien) {
    if(alien.isAttached()) {
      killAliens(alien.getSimilarCluster());
    }
  });
};

Alien.moveAliens = function() {
  aliens.forEach(function(invader) {
    invader.move();//.bind(invader);
  });
};

Alien.stageAlien = function(){
  let options = {
    pos: [canvas.width/2, canvas.height],
    vel: [0, 0],
    color: randomColor(),
    radius: RADIUS
  };

  newAlien = new Alien(options);
  aliens.push(newAlien);
  return newAlien;
};

Alien.fireCannon = function(angle, alien) {
  alien.vel = [
    SPEED * Math.sin(angle),
    -SPEED * Math.cos(angle)
  ];
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
  let new_x = (this.pos[0] + this.vel[0]);
  if(new_x > canvas.width || new_x < 0) {
    new_x -= this.vel[0] * 2;
    this.vel[0] *= -1;
  }
  let new_y = (this.pos[1] + this.vel[1]);
  if(new_y < 0){
    this.stop();
    let x_offset = topFlush ? 0 : RADIUS;
    new_y = RADIUS;
    // debugger
    new_x = RADIUS + 2 * RADIUS * Math.round((new_x - x_offset)/(2 * RADIUS));
    // let lowerBound = RADIUS * Math.round(new_x / RADIUS);
    // let extra = new_x - lowerBound;
    // if(extra < RADIUS/2 && !spaceOccupied([lowerBound, RADIUS])) {
    //   new_x = lowerBound;
    // } else {
    //   new_x = lowerBound + RADIUS;
    // }
  }
  this.pos = [new_x, new_y];
  this.draw();
  // debugger
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
    let x_dist = Math.abs(this.pos[0] - aliens[j].pos[0]);
    let y_dist = Math.abs(this.pos[1] - aliens[j].pos[1]);
    if(
      this !== aliens[j] &&
      x_dist <= RADIUS * 2 &&
      y_dist <= RADIUS * 2 &&
      aliens[j].alive &&
      this.color === aliens[j].color
    ) {
      similarNeighbors.push(aliens[j]);
    }
  }
  return similarNeighbors;
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

Alien.prototype.isAttached = function() {
  this.getSimilarCluster().forEach(function(alien) {
    if(alien.pos[0] === RADIUS) return true;
  });
  return false;
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

  // console.log("Lock pos is:");
  // console.log(pos);
  this.pos = pos;
  this.stop();
};

Alien.prototype.stopIfCollidingWith = function (otherAlien) {
  let x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
  let y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
    if(this.isMoving()) {
      // console.log(aliens);
      // console.log("before");
      // console.log("shot alien");
      // console.log(this.pos);
      // console.log("other alien");
      // console.log(otherAlien.pos);
      this.lock(otherAlien);
      // console.log(this.getSimilarCluster());
      let neighbors = this.getSimilarCluster();
      if(neighbors.length >2){
        killAliens(neighbors);
      }
      // console.log("after");
      // console.log("shot alien");
      // console.log(this.pos);
      // console.log("other alien");
      // console.log(otherAlien.pos);
    }
  }
};


module.exports = Alien;
