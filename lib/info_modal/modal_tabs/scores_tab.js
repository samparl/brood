// BUILD SCORES TAB
let scoresTab = $('<div class="c-tab">');
let scoresTabContent = $('<div class="c-tab__content scores">');
let scoresTitle = $("<div class='modal-title'>High Scores</div>");
scoresTabContent.append(scoresTitle);

let userScores = document.createElement("div");
userScores.className = "user-scores";
scoresTabContent.append(userScores);

scoresTab.append(scoresTabContent);

module.exports = scoresTab;
