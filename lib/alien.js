const Constants = require('./constants.js');
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

const RADIUS = Constants.RADIUS;

const Alien = function(options) {
  this.color = options.color;
  this.radius = options.radius;
  this.pos = options.pos;
  this.vel = options.vel;
};

Alien.prototype.draw = function() {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI*2);
  ctx.fill();
  ctx.closePath();
};

Alien.prototype.move = function() {
  let new_x = (this.pos[0] + this.vel[0]);
  if(new_x > canvas.width || new_x < 0) {
    new_x -= this.vel[0] * 2;
    this.vel[0] *= -1;
  }
  let new_y = (this.pos[1] + this.vel[1]);
  this.pos[0] = new_x;// % canvas.width;
  this.pos[1] = new_y;// % canvas.height;
  this.draw();
};

Alien.prototype.isMoving = function() {
  // debugger
  if(this.vel[0] !== 0 || this.vel[1] !== 0) return true;
  return false;
};

Alien.prototype.stop = function() {
  this.vel = [0,0];
};

Alien.prototype.lock = function(otherAlien) {
  let pos = [];
  let x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
  let y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
  let maj_axis = y_dist > x_dist ? 0 : 1;
  let min_axis = y_dist > x_dist ? 1 : 0;
  axial_dist = this.pos[maj_axis] - otherAlien.pos[maj_axis];

  if(axial_dist <= RADIUS) {
    pos[maj_axis] = otherAlien.pos[maj_axis];
  } else if(this.pos[maj_axis] > otherAlien.pos[maj_axis]) {
    pos[maj_axis] = otherAlien.pos[maj_axis] + RADIUS;
  } else {
    pos[maj_axis] = otherAlien.pos[maj_axis] - RADIUS;
  }

  pos[min_axis] = this.pos[min_axis] > otherAlien.pos[min_axis] ?
    otherAlien.pos[min_axis] + 2 * RADIUS :
    otherAlien.pos[min_axis] - 2 * RADIUS;
  this.pos = pos;
  this.stop();
};

Alien.prototype.stopIfCollidingWith = function (otherAlien) {
  let x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
  let y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
    if(this.isMoving()) {
      this.lock(otherAlien);
    }
    // this.stop();
    // otherAlien.stop();
  }
};


module.exports = Alien;
