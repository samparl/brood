var canvas = document.getElementById("brood-canvas");

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
let radius = 40;
let spacing = radius * Math.sqrt(3) / 2;
let xValues = [];

let idx = 1.5 * spacing;
while(idx + spacing < canvas.width) {
  xValues.push(idx);
  idx += (2 * spacing);
}

const Constants = {
  NUMROWS: 1,
  LOSSHEIGHT: canvas.height * 0.5,
  RADIUS: radius,
  X_SPACING: spacing,
  HORIZONTALS: xValues,
  VERTICES: 6,
  DELTA: 0.075,
  SPEED: 10,
  POINTS: 10,
  RICHOCHET_POINTS: 5,
  COLORS: [
      "green",
      "blue",
      "purple",
      "red",
      "orange"
  ],
  TYPES: [
    greenAlien,
    blueAlien,
    purpleAlien,
    redAlien,
    orangeAlien
  ]
};

module.exports = Constants;
