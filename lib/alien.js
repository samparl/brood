const Constants = require('./constants.js');
const Util = require('./util.js');
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

const RADIUS = Constants.RADIUS;
const SPEED = Constants.SPEED;

const Alien = function(options) {
  this.color = options.color;
  this.type = options.type;
  this.radius = options.radius;
  this.pos = options.pos;
  this.vel = options.vel;
  this.alive = true;
  this.staged = options.staged;
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
  let x_dist = Util.xDist(this, otherAlien);
  let y_dist = Util.yDist(this, otherAlien);
  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
    return true;
  } else {
    return false;
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
  // checkLoss();
  return [newX, newY];
};


Alien.prototype.isMoving = function() {
  if(this.vel[0] !== 0 || this.vel[1] !== 0) return true;
  return false;
};

Alien.prototype.stop = function() {
  this.vel = [0,0];
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



Alien.prototype.checkCollision = function (otherAlien) {
  // let x_dist = xDist(this, otherAlien);
  // let y_dist = yDist(this, otherAlien);
  if (this.touches(otherAlien)) {
    return this.isMoving() ? true : false;
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

module.exports = Alien;
