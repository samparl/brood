const Modal = require("./modal"),
      Tabs = require("./modal_tabs/tabs"),
      Rules = require("./modal_tabs/rules_tab"),
      Scores = require("./modal_tabs/scores_tab");

module.exports = function() {

  let content = document.createElement("div");
  content.className = "score-modal";

  let modalTabs = $(`<div id="tabs" class="c-tabs no-js">`);

  // BUILD NAVIGATOR
  let tabsNav = $(`<div class="c-tabs-nav">`);
  $(tabsNav).append('<a href="#" class="c-tabs-nav__link is-active">Rules</a>');
  $(tabsNav).append('<a href="#" class="c-tabs-nav__link">High Scores</a>');
  $(modalTabs).append(tabsNav);

  // APPEND TABS
  modalTabs.append(Rules);
  modalTabs.append(Scores);

  // DEFINE MODAL CONTENT
  $(content).append(modalTabs);

  let myModal = new Modal({
    content: content,
    maxWidth: 600
  });

  myModal.buildOut();

  // DEFINE TAB INTERACTIONS
  var myTabs = Tabs({
    el: '#tabs',
    tabNavigationLinks: '.c-tabs-nav__link',
    tabContentContainers: '.c-tab'
  });

  myTabs.init();
  return myModal;

};
