const Constants = require('./constants.js');
const Alien = require("./alien.js");

const canvas = document.getElementById("brood-canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = '../assets/images/cannon.png';
let DELTA = Constants.DELTA;

const Cannon = function() {
  this.color = "blue";//options.color;
  this.length = 80;
  this.width = 20;
  this.angle = 0;
};

drawCannon = function() {
  ctx.translate(canvas.width/2, canvas.height);
  ctx.translate(-canvas.width/2, -canvas.height);
};

Cannon.prototype.draw = function() {

  // ctx.translate(canvas.width/2, canvas.height);
  // ctx.rotate(angle);
  // ctx.drawImage(img, 0, -150, 200, 100);
  // ctx.rotate(-angle);
  // ctx.translate(-canvas.width/2, -canvas.height);
  // debugger

  ctx.translate(canvas.width/2, canvas.height);
  ctx.rotate(this.angle);
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.rect(-this.width/2, -this.length, this.width, this.length);
  ctx.fill();
  ctx.closePath();
  ctx.rotate(-this.angle);
  ctx.translate(-canvas.width/2, -canvas.height);

};

Cannon.prototype.onKeyDown = function(e) {
  if(e.keyCode === 39) {
    this.keydown = "right";
  }
  if(e.keyCode === 37) {
    this.keydown = "left";
  }
  if(e.keyCode === 32) {
    Alien.fireCannon(this.angle);
  }
};

Cannon.prototype.onKeyUp = function(e) {
  this.keydown = null;
};


Cannon.prototype.rotate = function() {
  if(this.keydown === "right") {
    this.angle += DELTA;
  }
  if(this.keydown === "left") {
    this.angle -= DELTA;
  }
};

module.exports = Cannon;
