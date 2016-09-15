// BUILD RULES TAB

let rulesTab = $('<div class="c-tab is-active">');
let rulesTabContent = $('<div class="c-tab__content rules">');

// BUILD RULES TAB TITLE
let rulesTabTitle = $('<div class="modal-title">Rules</div>');
rulesTabContent.append(rulesTabTitle);

let rules = $(
  `<ul>
  <li><p>Defend your home by killing all the aliens that you can, but beware:
  as night falls the aliens come in greater numbers.<p></li>

  <li><p>Aliens can't stand to be around too many of their own kind. Place three
  or more adjacent to one another and watch them die off!</p></li>
  <li><p>Earn the respect neighbors by killing more aliens! Each alien is worth 10
  respect.</p></li>
  <li><p>Ricocheting projectile aliens off the walls is impressive! Every time
  you bounce an alien off the wall you can expect another 5 respect.<p></li>
  </ul>`
);

rulesTabContent.append(rules);
rulesTab.append(rulesTabContent);

module.exports = rulesTab;
