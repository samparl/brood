const Constants = require("./constants");
const Game = require("./game");
const Modal = require("./modal");
const initFirebase = require("./initFirebase");

initFirebase();

const buildScores = function() {

  let content = document.createElement("div");
  content.className = "score-modal";

  let modalTitle = document.createElement("div");
  modalTitle.className = "modal-title";
  modalTitle.innerHTML = "High Scores";
  content.appendChild(modalTitle);

  const createList = function(snap) {

    let scoreList = document.createElement("ul");
    let userList = document.createElement("ul");

    Object.keys(snap.val()).forEach(function(score) {

      let username = document.createElement("li");
      username.className="username";
      username.innerHTML = snap.val()[score].email;
      userList.appendChild(username);
      // debugger

      let userScore = document.createElement("li");
      userScore.className="userScore";
      userScore.innerHTML = snap.val()[score].totalScore;
      scoreList.appendChild(userScore);

    });

    let userScores = document.createElement("div");
    userScores.className = "user-scores";
    userScores.appendChild(userList);
    userScores.appendChild(scoreList);
    content.appendChild(userScores);

  };

  firebase.database().ref('/scores/').once('value', createList);
  firebase.database().ref('/scores/').on('child_changed', createList);

  var myModal = new Modal({
    content: content,
    maxWidth: 600
  });

  return myModal;

};

let myModal = buildScores();

$("#view-style").click(function() {
  window.currentGame.skeleton = !window.currentGame.skeleton;
});

let game = new Game();

window.currentGame = game;

let scores = document.getElementById("high-scores");
scores.addEventListener("click", myModal.open.bind(myModal));

game.setup();
