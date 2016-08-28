const Constants = require("./constants");
const Game = require("./game");

let game = new Game();

window.currentGame = game;

$("#view-style").click(function() {
  window.currentGame.skeleton = !window.currentGame.skeleton;
});

game.setup();
