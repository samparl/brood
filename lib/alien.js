const Constants = require('./constants.js');
const Util = require('./util.js');
const Game = require('./game.js');
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
