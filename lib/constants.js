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



module.exports = {
  NUMROWS: 1,
  LOSSHEIGHT: 640,
  RADIUS: 50,
  X_SPACING: 50 * Math.sqrt(3) / 2,
  VERTICES: 6,
  DELTA: 0.075,
  SPEED: 10,
  POINTS: 10,
  COLORS: [
      "blue",
      "red",
      "yellow"
  ],
  TYPES: [
    greenAlien,
    blueAlien,
    purpleAlien,
    redAlien,
    orangeAlien
  ]
};
