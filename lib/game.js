const Constants = require("./constants");
const Brood = require("./brood.js");
const Cannon = require("./cannon.js");
const Background = require('./background');

const SPEED = Constants.SPEED;
const RADIUS = Constants.RADIUS;

var playFrame = $("#play");
var $replay = $(".replay");
var $replayMessage = $(".replay-message");

let scoreReport = document.getElementById('round-score');
let totalReport = document.getElementById('total-score');
var totalScore = 0;

var gameInterval;

var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

const Game = function(options) {
  window.currentGame = this;
  this.top = 0;
  this.shotCount = 0;
  this.score = 0;
  this.topFlush = true;
  this.brood = new Brood({game: this});
  this.cannon = new Cannon();
  this.skeleton = false;
  this.win = false;
  this.loss = false;
  this.saved = false;
};

//////// GAMEPLAY

Game.prototype.step = function() {
  Background.call(this);
  this.brood.stepAliens();
  if(this.loss) {
    this.end("You lose!");
    totalScore = 0;
  } else if(this.win){
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

//////// START/STOP PLAY METHODS

Game.prototype.setup = function() {
  document.getElementById('main-auth-button').disabled = false;

  scoreReport.textContent = this.score;
  totalReport.textContent = totalScore;

  $(".replay").css("display", "none");
  this.gameInterval = setInterval(this.step.bind(this), 10);
  var event = new CustomEvent('imagesLoaded');
  this.onKeyDown = this.onKeyDown.bind(this);
  this.onKeyUp = this.onKeyUp.bind(this);
  var keydownEvent = document.addEventListener('keydown', this.onKeyDown, true);
  var keyupEvent = document.addEventListener('keyup', this.onKeyUp, true);
  $("#view-style").attr('disabled', false);
};

Game.prototype.end = function(text) {
  totalScore += this.score;
  totalReport.textContent = totalScore;
  $("#view-style").attr('disabled', true);
  $(".replay").off();
  document.removeEventListener('keydown', this.onKeyDown);
  document.removeEventListener('keyup', this.onKeyUp);
  clearInterval(this.gameInterval);

  var user = firebase.auth().currentUser;
  let mainAuthButton = document.getElementById('main-auth-button');
  mainAuthButton.disabled = user ? false : true;

  if(this.loss) this.saveOnLoggedIn();
  $replayMessage.text(`${ text } Play again?`);
  $(".replay").on("click", ".fa-refresh", playAgain);
  $replay.css("display", "flex");

};

Game.prototype.complete = function () {
  return(
    this.win ||
    this.loss
  );
};

Game.prototype.saveOnLoggedIn = function() {
  var user = firebase.auth().currentUser;
  // debugger
  // If logged in then save
  if(user) this.saveScore(user);
};

Game.prototype.saveScore = function(user) {
  user.providerData.forEach(function (profile) {
    // console.log("Sign-in provider: "+profile.providerId);
    // console.log("  Provider-specific UID: "+profile.uid);
    // console.log("  Name: "+profile.displayName);
    // console.log("  Email: "+profile.email);
    // console.log("  Photo URL: "+profile.photoURL);
    // return gameData;

    if(!this.saved) {
      let gameData = {
        uid: user.uid,
        email: profile.email,
        score: this.score,
        totalScore: totalScore,
        date: new Date()
      };

      let scoreKey = firebase.database().ref().child('scores').push(gameData).key;
      this.saved = true;

    }
  }.bind(this));
};

const playAgain = function() {
  let game = new Game();
  game.setup();
};

//////// KEY LISTENERS AND THEIR CALLBACKS

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

module.exports = Game;
