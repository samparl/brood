const Constants = require("./constants");
const Alien = require("./alien.js");
const Cannon = require("./cannon.js");

var playFrame = $("#play");
var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");
let cannon = new Cannon();
var gameInterval;

// debugger

const step = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Alien.render();
  cannon.rotate();
  cannon.draw();
  if(Alien.loss()) {
    endGame("You lose!");
  } else if(Alien.win()){
    endGame("You win!");
  }
};

window.Alien = Alien;


const setupGame = function() {
  $replay.remove();
  Alien.reset();
  // '<canvas id="brood-canvas" width="800" height="800"></canvas>'
  gameInterval = setInterval(step.bind(this), 10);
  var event = new CustomEvent('imagesLoaded');
  // document.body.addEventListener('click', alert("images loaded!"));
  var keydownEvent = document.addEventListener('keydown', cannon.onKeyDown.bind(cannon));
  var keyupEvent = document.addEventListener('keyup', cannon.onKeyUp.bind(cannon));
};

const endGame = function(text) {
  document.removeEventListener('keydown', cannon.onKeyDown.bind(cannon));
  document.removeEventListener('keyup', cannon.onKeyUp.bind(cannon));
  clearInterval(gameInterval);
  $replay.text(`${ text } Play again?`);
  $replay.append('<i class="fa fa-refresh" aria-hidden="true"></i>');
  $replay.on("click", ".fa-refresh", setupGame);
  playFrame.append($replay);
};

const $replay = $(`<div width=${canvas.width} height=${canvas.height} class='replay'>
  </div>`);
  // <i class="fa fa-refresh" aria-hidden="true"></i>
// $replay.text('Play again?');

setupGame();
