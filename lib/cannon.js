const Constants = require('./constants.js');
const Brood = require("./brood.js");
const Game = require("./game.js");

const canvas = document.getElementById("brood-canvas");
const ctx = canvas.getContext("2d");
const cannon = new Image();
cannon.src = 'assets/images/cannon_straight.png';
let cannonHeight;
let cannonWidth;
cannon.onload = function() {
  cannonWidth = cannon.width;
  cannonHeight = cannon.height;
  // debugger
}.bind(this);

let DELTA = Constants.DELTA;
let RADIUS = Constants.RADIUS;
// debugger
const Cannon = function() {
  this.color = "#d3d3d3";
  this.length = canvas.height/5;
  this.width = RADIUS * 2.5;
  this.angle = 0;
  this.spaceDown = false;
  this.stagedAlien = null;
  this.direction = null;
};

const drawCannon = function() {
  ctx.translate(canvas.width/2, canvas.height);
  ctx.translate(-canvas.width/2, -canvas.height);
};

Cannon.prototype.draw = function() {
  let cannonLength = RADIUS * 3;
  let cannonWidth = RADIUS * 3;
  ctx.translate(canvas.width/2, canvas.height - RADIUS);
  ctx.rotate(-Math.PI/2 + this.angle);
  ctx.translate(0, -cannonWidth);
  ctx.drawImage(cannon, 0, 0, cannonLength, 2 * cannonWidth);
  ctx.translate(0, cannonWidth);
  ctx.rotate(Math.PI/2 - this.angle);
  ctx.translate(-canvas.width/2, -canvas.height + RADIUS);


  ctx.translate(canvas.width/2, canvas.height);
  ctx.beginPath();
  ctx.arc(0, -RADIUS, RADIUS*1.5, 0, Math.PI, true);
  ctx.rect(-1.5 * RADIUS, -RADIUS, RADIUS * 3, RADIUS);
  ctx.fillStyle = '#3a3a3a';
  ctx.fill();
  ctx.closePath();
  ctx.translate(-canvas.width/2, -canvas.height);

};

Cannon.prototype.rotate = function() {
  if(this.direction === "right" &&
    this.angle < 5*Math.PI/12
  ) {
    this.angle += DELTA;
  }
  if(this.direction === "left" &&
    this.angle > - 5*Math.PI/12
) {
    this.angle -= DELTA;
  }
};

module.exports = Cannon;
