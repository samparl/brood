const Constants = require('./constants.js');
const Alien = require("./alien.js");

const canvas = document.getElementById("brood-canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = '../assets/images/cannon.png';
let DELTA = Constants.DELTA;

const Cannon = function() {
  this.color = "blue";
  this.length = 80;
  this.width = 20;
  this.angle = 0;
  this.spaceDown = false;
  this.stagedAlien = null;
};

drawCannon = function() {
  ctx.translate(canvas.width/2, canvas.height);
  ctx.translate(-canvas.width/2, -canvas.height);
};

Cannon.prototype.draw = function() {

  ctx.translate(canvas.width/2, canvas.height);
  ctx.rotate(this.angle);
  ctx.fillStyle = "#000";

  ctx.beginPath();
  ctx.rect(-this.width/2, -this.length * 3 / 2, this.width, this.length);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  // debugger
  ctx.arc(0, 0, this.length/2, 0, 2 * Math.PI, false);
  ctx.strokeStyle = '#003300';
  ctx.stroke();
  ctx.closePath();

  ctx.rotate(-this.angle);
  ctx.translate(-canvas.width/2, -canvas.height);

};

Cannon.prototype.onKeyDown = function(e) {
  if(e.keyCode === 39) {
    this.direction = "right";
  }
  if(e.keyCode === 37) {
    this.direction = "left";
  }
  if(e.keyCode === 32) {
    if(!this.spaceDown) {
      this.stagedAlien = Alien.stageAlien();
    }
    this.spaceDown = true;
    // debugger
  }
};

Cannon.prototype.onKeyUp = function(e) {
  this.direction = null;
  this.spaceDown = false;
  if(e.keyCode === 32) Alien.fireCannon(this.angle, this.stagedAlien);
};


Cannon.prototype.rotate = function() {
  if(this.direction === "right") {
    this.angle += DELTA;
  }
  if(this.direction === "left") {
    this.angle -= DELTA;
  }
};

module.exports = Cannon;
