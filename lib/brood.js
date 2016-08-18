const Constants = require("./constants");
const Alien = require("./alien.js");
const Cannon = require("./cannon.js");

var canvas = document.getElementById("brood-canvas");
var ctx = canvas.getContext("2d");

const COLORS = [
    "blue",
    "red",
    "yellow"
];

const RADIUS = Constants.RADIUS;
const SPEED = Constants.SPEED;

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

const getVelocity = function(vector){
  let x = vector[0];
  let y = vector[1];
  let result = [
    x/Math.sqrt(x * x + y * y),
    y/Math.sqrt(x * x + y * y)
  ];
  return result;
};

const aliens = [];

const shootAlien = function(){
  let options = {
    pos: [canvas.width/2, canvas.height],
    vel: getVelocity([-1, -2]),
    color: randomColor(),
    radius: RADIUS
  };

  newAlien = new Alien(options);
  aliens.push(newAlien);
};

placeRandomAliens = function(start_x, end_x, y, likelihood) {
  let pos = start_x;
  // Use the "chain" variable to track how many consecutive aliens have been placed
  let chain = 0;
  let next_likelihood = likelihood - 0.15;
  // let placement_likelihood = 0.75;
  let chance;
  while(pos < end_x) {
    chance = Math.random();
    if(chance < likelihood){
      let options = {
        pos: [pos, y],
        vel: [0,0],
        color: randomColor(),
        radius: RADIUS
      };
      aliens.push(new Alien(options));
      chain += 1;
    } else {
      if(chain > 1 && next_likelihood > 0){
        placeRandomAliens(
          pos - (2 * RADIUS * chain) + RADIUS,
          pos - (2 * RADIUS),
          y + 2 * RADIUS,
          next_likelihood
        );
      }
      chain = 0;
    }

    pos += 2 * RADIUS;
  }
// Call placeAliens on the length approaching the final chain
  if(chain > 1){
    // debugger
    placeRandomAliens(
      pos - (2 * RADIUS * chain) + RADIUS,
      pos - (2 * RADIUS),
      y + 2 * RADIUS,
      next_likelihood
    );
  }
};

const placeAlienRows = function() {
  for(let level = 0; level < 5; level++){
    let pos = RADIUS + (level % 2) * RADIUS;
    while(pos < canvas.width) {
      let height = RADIUS + level * 2 * RADIUS;
      let options = {
        pos: [pos, height],
        vel: [0,0],
        color: randomColor(),
        radius: RADIUS
      };

      aliens.push(new Alien(options));
      pos += 2 * RADIUS;
    }
  }
};

const checkCollisions = function() {
  for(let i = 0; i < (aliens.length); i++) {
    for(let j = 0; j < (aliens.length); j++) {
      if(i !=j) aliens[i].stopIfCollidingWith(aliens[j]);
    }
  }
};

const moveAliens = function() {
  aliens.forEach(function(invader) {
    invader.move();//.bind(invader);
  });
};

const fireCannon = function() {
  let options = {
    pos: [canvas.width/2, canvas.height],
    vel: [
      SPEED * Math.cos(cannon.angle),
      SPEED * Math.sin(cannon.angle)
    ],
    color: randomColor(),
    radius: RADIUS
  };

  newAlien = new Alien(options);
  aliens.push(newAlien);
};

const step = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cannon.rotate();
  cannon.draw();
  moveAliens();
  checkCollisions();
};

// placeRandomAliens(RADIUS, canvas.width, RADIUS, 1);
placeAlienRows();
setInterval(step.bind(this), 10);
shootAlien();
let cannon = new Cannon();
document.addEventListener('keydown', cannon.onKeyDown.bind(cannon));
document.addEventListener('keyup', cannon.onKeyUp.bind(cannon));
