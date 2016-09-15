const Game = require("./game"),
      InfoModal = require('./info_modal/info_modal'),
      ScoreList = require("./info_modal/modal_tabs/score_list"),
      initFirebase = require("./initFirebase"),
      Images = require('./image_loader');

initFirebase();

let myModal = InfoModal();

let scores = document.getElementById("high-scores");

let handleGameInfo = function() {
  firebase.database().ref('/scores/').orderByChild('highScore').limitToLast(5).once('value', ScoreList);
  myModal.open.call(myModal);
};

scores.addEventListener("click", handleGameInfo);

// Wait until alien images are all loaded before initializing the game

let init = function() {
  console.log("entry file");
  let game = new Game();
  window.currentGame = game;
  $("#view-style").click(function() {
    window.currentGame.skeleton = !window.currentGame.skeleton;
  });
  game.setup();
};

Images.onReady(init);
