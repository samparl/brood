const Images = require('./image_loader');
const canvas = document.getElementById("brood-canvas");

// LOAD ALIENS
let blueAlien = "assets/images/aliens/smiley_blue_alien_test.svg",
    greenAlien = "assets/images/aliens/smiley_green_alien.svg",
    redAlien = "assets/images/aliens/smiley_red_alien_test.svg",
    orangeAlien = "assets/images/aliens/smiley_orange_alien_test.svg",
    purpleAlien = "assets/images/aliens/smiley_purple_alien_test.svg";

let alienTypes = [
  greenAlien,
  blueAlien,
  purpleAlien,
  redAlien,
  orangeAlien
];

Images.load(alienTypes);

Images.onReady(function() {
  console.log("constants file");
  alienTypes.forEach(function(img, idx) {
    alienTypes[idx] = Images.get(img);
  });
}.bind(this));

// DEFINE SPACING
// debugger
let radius = canvas.width / 15;//40;
let spacing = radius * Math.sqrt(3) / 2;
let xValues = [];

let idx = 1.5 * spacing;
while(idx + spacing < canvas.width) {
  xValues.push(idx);
  idx += (2 * spacing);
}

const Constants = {
  NUMROWS: 4,
  LOSSHEIGHT: canvas.height * 0.7,
  RADIUS: radius,
  X_SPACING: spacing,
  HORIZONTALS: xValues,
  VERTICES: 6,
  DELTA: 0.03,
  SPEED: 15,
  POINTS: 10,
  RICHOCHET_POINTS: 5,
  COLORS: [
      "green",
      "blue",
      "purple",
      "red",
      "orange"
  ],
  TYPES: alienTypes
};

module.exports = Constants;
