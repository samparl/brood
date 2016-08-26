const Constants = require("./constants");
const Brood = require("./brood.js");
const Cannon = require("./cannon.js");

const SPEED = Constants.SPEED;
const RADIUS = Constants.RADIUS;

var playFrame = $("#play");
let scoreReport = document.getElementById('player-score');
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");
var gameInterval;

const Game = function(options) {
  this.top = 0;
  this.shotCount = 0;
  this.score = 0;
  this.topFlush = true;
  this.brood = new Brood({game: this});
  this.cannon = new Cannon();
  // window.testAlien = this.brood.movingAliens[0];
};

// IS THIS STILL NEEDED?
Game.reset = function() {
  this.top = 0;
  this.loss = false;
  this.win = false;
  initializeAliens();
};

//////// GAMEPLAY

Game.prototype.step = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  this.drawCeiling();
  // this.brood.renderAliens();
  this.brood.stepAliens();
  this.cannon.rotate();
  this.cannon.draw();
  if(this.brood.loss) {
    this.end("You lose!");
  } else if(this.brood.win){
    this.end("You win!");
  }
};

Game.prototype.updateScore = function() {
  this.score += Constants.POINTS;
  scoreReport.textContent = `Your score: ${ this.score }`;
};

Game.prototype.countShots = function() {
  this.shotCount += 1;
  // if(this.shotCount % 10 === 0) this.resetTop();
};

Game.prototype.resetTop = function() {
  this.top += 2 * RADIUS;
  this.brood.shiftAliens();
};

Game.prototype.drawCeiling = function() {
  ctx.beginPath();
  ctx.fillStyle = "#d3d3d3";
  ctx.rect(0,0,canvas.width, this.top);
  ctx.fill();
  ctx.closePath();
};

//////// START/STOP PLAY METHODS

Game.prototype.setup = function() {
  $replay.remove();
  gameInterval = setInterval(this.step.bind(this), 10);
  var event = new CustomEvent('imagesLoaded');
  var keydownEvent = document.addEventListener('keydown', this.onKeyDown.bind(this));
  var keyupEvent = document.addEventListener('keyup', this.onKeyUp.bind(this));
};

Game.prototype.end = function(text) {
  console.log("The end");
  document.removeEventListener('keydown', this.onKeyDown.bind(this));
  document.removeEventListener('keyup', this.onKeyUp.bind(this));
  clearInterval(gameInterval);
  $replay.text(`${ text } Play again?`);
  $replay.append('<i class="fa fa-refresh" aria-hidden="true"></i>');
  $replay.on("click", ".fa-refresh", playAgain);
  playFrame.append($replay);
};

const playAgain = function() {
  let game = new Game();
  game.setup();
};

//////// LISTENERS AND THEIR CALLBACKS

Game.prototype.onKeyDown = function(e) {
  // debugger
  if(e.keyCode === 39) {
    this.cannon.direction = "right";
  } else if(e.keyCode === 37) {
    this.cannon.direction = "left";
  } else if(e.keyCode === 32) {
    e.preventDefault();
    if(!this.cannon.spaceDown) {
      this.cannon.stagedAlien = this.brood.stageAlien();
    }
    this.cannon.spaceDown = true;
  }
};

Game.prototype.onKeyUp = function(e) {
  this.cannon.direction = null;
  this.cannon.spaceDown = false;
  if(e.keyCode === 32) this.fireCannon(this.cannon.angle, this.cannon.stagedAlien);
};

Game.prototype.fireCannon = function(angle, alien) {
  alien.vel = [
    SPEED * Math.sin(angle),
    -SPEED * Math.cos(angle)
  ];
  alien.staged = false;
  this.countShots();
};


const $replay = $(`<div width=${canvas.width} height=${canvas.height} class='replay'>
  </div>`);

module.exports = Game;
