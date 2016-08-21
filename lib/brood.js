const Constants = require("./constants");
const Alien = require("./alien.js");
const Cannon = require("./cannon.js");

var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");
let cannon = new Cannon();

const step = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Alien.render();
  cannon.rotate();
  cannon.draw();
};

Alien.initializeAliens();
setInterval(step.bind(this), 10);

let event = new CustomEvent('imagesLoaded');
window.Alien = Alien;
// document.body.addEventListener('click', alert("images loaded!"));
document.addEventListener('keydown', cannon.onKeyDown.bind(cannon));
document.addEventListener('keyup', cannon.onKeyUp.bind(cannon));
