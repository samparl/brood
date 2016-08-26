const Constants = require('./constants');

const RADIUS = Constants.RADIUS;
const COLORS = Constants.COLORS;

var greenAlien = new Image();
greenAlien.src = "assets/images/aliens/smiley_green_alien.svg";
var blueAlien = new Image();
blueAlien.src = "assets/images/aliens/smiley_blue_alien.svg";
var redAlien = new Image();
redAlien.src = "assets/images/aliens/smiley_red_alien.svg";
var orangeAlien = new Image();
orangeAlien.src = "assets/images/aliens/smiley_orange_alien.svg";
var purpleAlien = new Image();
purpleAlien.src = "assets/images/aliens/smiley_purple_alien.svg";

TYPES = [
  greenAlien,
  blueAlien,
  purpleAlien,
  redAlien,
  orangeAlien
];

module.exports = {
  randomColor: function() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  },

  randomType: function() {
    return TYPES[Math.floor(Math.random() * TYPES.length)];
  },

  randomVelocity: function() {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let speed = Math.random();
    x = x / Math.sqrt(x * x + y * y);
    y = y / Math.sqrt(x * x + y * y);
    return [x, y];
  },

  getVelocity: function(vector){
    let x = vector[0];
    let y = vector[1];
    let result = [
      x/Math.sqrt(x * x + y * y),
      y/Math.sqrt(x * x + y * y)
    ];
    return result;
  },

  xDist: function(first, second) {
    return Math.abs(first[0] - second[0]);
  },

  yDist: function(first, second) {
    return Math.abs(first[1] - second[1]);
  },

  onCanvas: function(pos) {
    return ( pos[0] > 0 || pos[0] < canvas.width ? true : false);
  },

  inRange: function(posA, posB) {
    return (
      this.xDist(posA, posB) < Constants.RADIUS * 0.01 &&
      this.yDist(posA, posB) < Constants.RADIUS * 0.01
    );
  }
};
