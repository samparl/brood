module.exports = function(snap) {

  let scoreList = document.createElement("ul");
  let userList = document.createElement("ul");

  const compareScores = function(first, second) {
    let firstScore = snap.val()[first].totalScore;
    let secondScore = snap.val()[second].totalScore;
    return firstScore < secondScore ? 1 : -1;
  };

  Object.keys(snap.val()).sort(compareScores).forEach(function(score) {

    let username = document.createElement("li");
    username.className="username";
    username.innerHTML = snap.val()[score].email;
    userList.appendChild(username);

    let userScore = document.createElement("li");
    userScore.className="userScore";
    userScore.innerHTML = snap.val()[score].totalScore;
    scoreList.appendChild(userScore);

  });

  let userScores = document.createElement("div");
  userScores.className = "user-scores";
  userScores.appendChild(userList);
  userScores.appendChild(scoreList);

  $(".user-scores").replaceWith(userScores);
};
