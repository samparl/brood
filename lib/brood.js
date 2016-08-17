const Alien = require("./alien.js");

var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

// var x = canvas.width/2;
// var y = canvas.height - 30;
// var pos = [x,y];
var dx = 1;
var dy = 1;
var vel = [dx, dy];

const COLORS = [
    "blue",
    "red",
    "yellow"
];

const RADIUS = 20;

const randomColor = function() {
  return COLORS[Math.floor(Math.random() * 3)];
};

const randomVelocity = function() {
  let x = Math.random() * 2 - 1;
  let y = Math.random() * 2 - 1;
  let speed = Math.random();
  x = x / Math.sqrt(x * x + y * y);
  y = y / Math.sqrt(x * x + y * y);
  return [x, y];
};

const aliens = [];

for(let i = 0; i < 5; i++) {
  let coefficient = 40;
  let options = {
    pos: [40 + coefficient * i, 40],
    vel: randomVelocity(),//[0,0],
    color: randomColor(),
    radius: RADIUS
  };
  aliens.push(new Alien(options));
}

const checkCollisions = function() {
  for(let i = 0; i < (aliens.length - 1); i++) {
    for(let j = i + 1; j < aliens.length; j++) {
      console.log([i, j]);
      aliens[i].stopIfCollidingWith(aliens[j]);
    }
  }
};

const moveAliens = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  aliens.forEach(function(invader) {
    invader.move();//.bind(invader);
  });
};

const step = function() {
  moveAliens();
  checkCollisions();
};

setInterval(step.bind(this), 10);
