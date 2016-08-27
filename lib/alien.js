const Constants = require('./constants.js');
const Util = require('./util.js');
const Game = require('./game.js');
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

const polygon = function(context, color, x, y, radius, sides, startAngle, anticlockwise) {
  if (sides < 3) return;
  var a = (Math.PI * 2)/sides;
  a = anticlockwise ? -a : a;
  context.beginPath();
  context.save();
  context.translate(x,y);
  context.rotate(startAngle);
  context.moveTo(radius,0);
  for (var i = 1; i <= sides; i++) {
    context.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
  }
  context.strokeStyle = color;
  ctx.stroke();
  context.closePath();
  context.restore();
  context.closePath();
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
    // polygon(ctx, this.color, this.pos[0], this.pos[1], this.radius, 6, Math.PI/2);
    // circle(ctx, this.pos[0], this.pos[1], Constants.X_SPACING, this.color);

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
