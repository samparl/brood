
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height - 30;
var pos = [x,y];
var dx = 1;
var dy = 1;
var vel = [dx, dy];
const RADIUS = 20;

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
  this.pos[0] = (this.pos[0] + this.vel[0]) % canvas.width;
  this.pos[1] = (this.pos[1] + this.vel[1]) % canvas.height;
  this.draw();
};

Alien.prototype.stop = function() {
  this.vel = [0,0];
};

Alien.prototype.lock = function(otherAlien) {

};

Alien.prototype.stopIfCollidingWith = function (otherAlien) {
  x_dist = Math.abs(this.pos[0] - otherAlien.pos[0]);
  y_dist = Math.abs(this.pos[1] - otherAlien.pos[1]);
  if (x_dist <= RADIUS * 2 && y_dist <= RADIUS * 2) {
    this.stop();
    otherAlien.stop();
  } else {
    // debugger
  }
};


module.exports = Alien;
