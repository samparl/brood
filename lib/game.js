const Constants = require("./constants");
const Brood = require("./brood.js");
const Cannon = require("./cannon.js");

const SPEED = Constants.SPEED;
const RADIUS = Constants.RADIUS;

var playFrame = $("#play");
let scoreReport = document.getElementById('round-score');
let totalReport = document.getElementById('total-score');
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");
var gameInterval;
var totalScore = 0;

let canvasBackground = ctx.createLinearGradient(canvas.height, 0, canvas.height, canvas.width);
canvasBackground.addColorStop(1, "#f44336");
canvasBackground.addColorStop(0.6, "#2196f3");

let nightSky = ctx.createLinearGradient(canvas.height, 0, canvas.height, canvas.width);
nightSky.addColorStop(0, "#000");
nightSky.addColorStop(0.9, "#2196f3");

const Game = function(options) {
  window.currentGame = this;
  this.top = 0;
  this.shotCount = 0;
  this.score = 0;
  this.topFlush = true;
  this.brood = new Brood({game: this});
  this.cannon = new Cannon();
  this.skeleton = false;
};

//////// GAMEPLAY

Game.prototype.step = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  this.drawBackground();
  this.brood.stepAliens();
  if(this.brood.loss) {
    this.end("You lose!");
    totalScore = 0;
  } else if(this.brood.win){
    totalScore += this.score;
    this.end("You win!");
  }
};

Game.prototype.updateScore = function() {
  this.score += Constants.POINTS;
  scoreReport.textContent = this.score;
};

Game.prototype.richochet = function() {
  this.score += Constants.RICHOCHET_POINTS;
  scoreReport.textContent = this.score;
};

Game.prototype.countShots = function() {
  this.shotCount += 1;
  if(this.shotCount % 15 === 0) this.resetTop();
};

Game.prototype.resetTop = function() {
  this.top += 2 * RADIUS;
};

Game.prototype.drawBackground = function() {
  let canvasBackground = ctx.createLinearGradient(this.top, this.top, this.top, canvas.height);
  canvasBackground.addColorStop(1, "#f44336");
  canvasBackground.addColorStop(0.6, "#2196f3");

  let nightSky = ctx.createLinearGradient(0, this.top, 0, 0);
  nightSky.addColorStop(1, "#000");
  nightSky.addColorStop(0.01, "#2196f3");

  ctx.fillStyle = canvasBackground;
  if(this.skeleton) {
    this.drawCeiling();
  } else {
    ctx.fillRect(0, this.top, canvas.width, canvas.height);
    ctx.fillStyle = nightSky;
    ctx.fillRect(0, 0, canvas.width, this.top);
    this.drawBuildings();
  }
};

Game.prototype.drawCeiling = function() {
  ctx.beginPath();
  ctx.fillStyle = "#d3d3d3";
  ctx.rect(0,0,canvas.width, this.top);
  ctx.fill();
  ctx.closePath();
};

Game.prototype.drawBuildings = function() {

};

//////// START/STOP PLAY METHODS

Game.prototype.setup = function() {
  scoreReport.textContent = this.score;
  $replay.remove();
  gameInterval = setInterval(this.step.bind(this), 10);
  var event = new CustomEvent('imagesLoaded');
  var keydownEvent = document.addEventListener('keydown', this.onKeyDown.bind(this));
  var keyupEvent = document.addEventListener('keyup', this.onKeyUp.bind(this));
};

Game.prototype.end = function(text) {
  document.removeEventListener('keydown', this.onKeyDown.bind(this));
  document.removeEventListener('keyup', this.onKeyUp.bind(this));
  clearInterval(gameInterval);
  $replay.text(`${ text } Play again?`);
  $replay.append('<i class="fa fa-refresh" aria-hidden="true"></i>');
  $replay.on("click", ".fa-refresh", playAgain);
  playFrame.append($replay);
  totalReport.textContent = totalScore;
};

const playAgain = function() {
  let game = new Game();
  game.setup();
};

//////// LISTENERS AND THEIR CALLBACKS

Game.prototype.onKeyDown = function(e) {
  if(e.keyCode === 39) {
    this.cannon.direction = "right";
  } else if(e.keyCode === 37) {
    this.cannon.direction = "left";
  } else if(e.keyCode === 32) {
    e.preventDefault();
    if(!this.cannon.spaceDown) {
      this.countShots();
      this.brood.stageAlien();
    }
    this.cannon.spaceDown = true;
  }
};

Game.prototype.onKeyUp = function(e) {
  this.cannon.direction = null;
  this.cannon.spaceDown = false;
  if(e.keyCode === 32) {
    let alien = this.brood.stagedAliens.pop();
    this.brood.movingAliens[alien.id] = alien;
    this.fireCannon(this.cannon.angle, alien);
  }
};

Game.prototype.fireCannon = function(angle, alien) {
  alien.vel = [
    SPEED * Math.sin(angle),
    -SPEED * Math.cos(angle)
  ];
  alien.pos[1] -= this.top;
  alien.staged = false;
};


const $replay = $(`<div width=${canvas.width} height=${canvas.height} class='replay'>
  </div>`);

module.exports = Game;
