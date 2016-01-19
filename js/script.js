//http://www.tutorialrepublic.com/codelab.php?topic=faq&file=bootstrap-keep-last-selected-tab-active-on-page-refresh
//var myArray = []; if (!myArray[0]) myFunction();


if (!juis) {
  var juis = {};
}

juis.tabList = {
  tabGroups: document.querySelectorAll(".g-tab__tab-group"),
  storageIndex: "selectedTabPanel" + document.location,
  init: function() {
    //if tab groups don't exist
    if (!document.querySelector(".g-tab__tab-group")) {
      return;
    }
    juis.tabList.setup();
    juis.tabList.bind();
  },
  setup: function () {
    //fetch previously selected tabs
    var currentTabs = juis.tabList.getCurrentTabs();

    //initialise tabs
    for (var i=0; i < juis.tabList.tabGroups.length; i++) {
      //hide tab panels (for all tab groups)
      var tabPanels = juis.tabList.tabGroups[i].querySelectorAll(".g-tab__tab-panel");

      var anyShown = false;
      for (var j=0; j < tabPanels.length; j++) {
        //if tab panel ID is not in currentTabs
        if (currentTabs.indexOf("#" + tabPanels[j].id) === -1) {
          //hide
          tabPanels[j].setAttribute("aria-hidden", "true");
        } else {
          //leave it visible
          anyShown = true;

          //select associated tab
          document.querySelector(".g-tab__tab a[href='#" + tabPanels[j].id + "']").parentElement.setAttribute("aria-selected", "true");
        }
      }

      //if no tab panels are shown
      if (!anyShown) {
        //show the first tab panel
        tabPanels[0].setAttribute("aria-hidden", "false");

        //select first tab
        var tabs = juis.tabList.tabGroups[i].querySelectorAll(".g-tab__tab");
        tabs[0].setAttribute("aria-selected", "true");
      }
    }
  },
  bind: function() {
    var tabs = document.querySelectorAll(".g-tab__tab");
    //if any of the tabs are clicked run activateTab
    for (var i=0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", juis.tabList.activateTab);
    }
  },
  activateTab: function (event) {
    //check if there are any tab groups on the page
    var tabGroup = this.parentElement.parentElement;

    if (!tabGroup.classList.contains("g-tab__tab-group")) {
      //todo: throw error "Broken HTML!"
      console.log("HTML does not contain correct class for tab group!");
    }

    //get currently selected tabs
    var currentTabs = juis.tabList.getCurrentTabs();

    //deselect old clicked tab
    var oldTabPanel;
    for (var i=0; i < this.parentElement.children.length; i++) {
      if (this.parentElement.children[i].hasAttribute("aria-selected")) {
        oldTabPanel = this.parentElement.children[i].firstChild.getAttribute("href");
        this.parentElement.children[i].removeAttribute("aria-selected");
        break;
      }
    }

    //hide old tab panel
    document.querySelector(oldTabPanel).setAttribute("aria-hidden", "true");

    //remove old tab ID from storage
    var tabIndex = currentTabs.indexOf(oldTabPanel);
    if (tabIndex > -1) {
      currentTabs.splice(tabIndex, 1);
    }

    //select new clicked tab
    this.setAttribute("aria-selected", "true");

    //show new tab panel
    var newTabPanel = this.firstChild.getAttribute("href");

    //show new tab
    document.querySelector(newTabPanel).setAttribute("aria-hidden", "false");

    //add new tab to storage
    currentTabs.push(newTabPanel);
    localStorage.setItem(juis.tabList.storageIndex, currentTabs.join());

    //prevent hash change
    event.preventDefault();
    return false;
    //switch to the selected tab
    //no point having bind?
    //how to loop
    //when the first tab is clicked, show its tab panel and hide the other tab panels
/*    juis.tabList.tabs[0].onclick = function(){
      juis.tabList.tabpanels[0].setAttribute("aria-hidden", "false");
      juis.tabList.tabpanels[1].setAttribute("aria-hidden", "true");
      juis.tabList.tabpanels[2].setAttribute("aria-hidden", "true");
      localStorage.setItem("selectedtab", "1");
    };
    //when the second tab is clicked, show its tab panel and hide the other tab panels
    juis.tabList.tabs[1].onclick = function(){
      juis.tabList.tabpanels[1].setAttribute("aria-hidden", "false");
      juis.tabList.tabpanels[0].setAttribute("aria-hidden", "true");
      juis.tabList.tabpanels[2].setAttribute("aria-hidden", "true");
      localStorage.setItem("selectedtab", "2");
    };
    //when the third tab is clicked, show its tab panel and hide the other tab panels
    juis.tabList.tabs[2].onclick = function(){
      juis.tabList.tabpanels[2].setAttribute("aria-hidden", "false");
      juis.tabList.tabpanels[1].setAttribute("aria-hidden", "true");
      juis.tabList.tabpanels[0].setAttribute("aria-hidden", "true");
      localStorage.setItem("selectedtab", "3");
    };
    */
  },
  getCurrentTabs: function() {
    var currentTabs = new Array();
    var storedTabs = localStorage.getItem(juis.tabList.storageIndex);
    if (storedTabs) {
      currentTabs = storedTabs.split(",");
    }
    return currentTabs;
  }
};

document.addEventListener("DOMContentLoaded", function() {
  juis.tabList.init();
});
