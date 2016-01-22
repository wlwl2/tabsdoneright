if (!juis) {
  var juis = {};
}

juis.tabList = {
  tabGroups: document.querySelectorAll(".g-tab__tab-group"),
  tabLista: document.querySelectorAll(".g-tab__tab-list a"),
  //hash in the URL (document.location) is dangerous?
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
    //make all tablist a's unselectable and label all tabs with their role
    for (var h=0; h < juis.tabList.tabLista.length; h++) {
      juis.tabList.tabLista[h].setAttribute("tabindex", "-1");
      juis.tabList.tabLista[h].parentElement.setAttribute("role", "tab");
    };

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
          //hide it
          tabPanels[j].setAttribute("aria-hidden", "true");
          //select associated tab (for tabindex)
          document.querySelector(".g-tab__tab a[href='#" + tabPanels[j].id + "']").parentElement.setAttribute("tabindex", "-1");
        }
        else {
          //leave it visible
          anyShown = true;
          tabPanels[j].setAttribute("role", "tabpanel")
          tabPanels[j].setAttribute("tabindex", "0")
          //select associated tab
          document.querySelector(".g-tab__tab a[href='#" + tabPanels[j].id + "']").parentElement.setAttribute("aria-selected", "true");
          document.querySelector(".g-tab__tab a[href='#" + tabPanels[j].id + "']").parentElement.setAttribute("tabindex", "0");
        }
      }

      //if no tab panels are shown
      if (!anyShown) {
        //show the first tab panel
        tabPanels[0].setAttribute("aria-hidden", "false");
        tabPanels[0].setAttribute("tabindex", "0");
        tabPanels[0].setAttribute("role", "tabpanel");

        //make the other tabpanels have a tabindex of -1
        for (var j=1; j < tabPanels.length; j++) {
          tabPanels[j].setAttribute("tabindex", "-1");
        };

        //select first tab
        var tabs = juis.tabList.tabGroups[i].querySelectorAll(".g-tab__tab");
        tabs[0].setAttribute("aria-selected", "true");
        tabs[0].setAttribute("tabindex", "0");

        //make the other tabs have a tabindex of -1
        for (var k=1; k < tabPanels.length; k++) {
          tabs[k].setAttribute("tabindex", "-1");
        };
      }
    }
  },
  bind: function() {
    var tabs = document.querySelectorAll(".g-tab__tab");
    //if any of the tabs are clicked run activateTab
    for (var i=0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", juis.tabList.activateTab);
      tabs[i].addEventListener("keydown", function (event) {
        //if modifier key is pressed, get out (don't change tabs with left or right)
        switch (event.key) {
          case "ArrowLeft":
            // Do something for "left arrow" key press.
            juis.tabList.switchTab(this.previousElementSibling, event);
            break;
          case "ArrowRight":
            // Do something for "right arrow" key press.
            juis.tabList.switchTab(this.nextElementSibling, event);
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        };
      });
      tabs[i].onkeydown = function(event) {
        if (!event)
            event = window.event;
            var code = event.keyCode;
        if (event.charCode && code == 0)
            code = event.charCode;
        switch(code) {
          case 37:
                // Key left.
                juis.tabList.switchTab(this.previousElementSibling, event);
                break;
          case 39:
                // Key right.
                juis.tabList.switchTab(this.nextElementSibling, event);
                break;
        };
      };
    };
  },
  switchTab: function (sibling, event) {
    if (!sibling || !sibling.classList.contains("g-tab__tab")) {
      return;
    }

    //set focus on the prev tab
    sibling.focus();
    sibling.click();
    event.preventDefault();
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
        this.parentElement.children[i].setAttribute("tabindex", "-1");
        break;
      }
    }

    //hide old tab panel
    document.querySelector(oldTabPanel).setAttribute("aria-hidden", "true");
    document.querySelector(oldTabPanel).setAttribute("tabindex", "-1");

    //remove old tab ID from storage
    var tabIndex = currentTabs.indexOf(oldTabPanel);
    if (tabIndex > -1) {
      currentTabs.splice(tabIndex, 1);
    }

    //select new clicked tab
    this.setAttribute("aria-selected", "true");
    this.setAttribute("tabindex", "0");

    //show new tab panel
    var newTabPanel = this.firstChild.getAttribute("href");

    //show new tab
    document.querySelector(newTabPanel).setAttribute("aria-hidden", "false");
    document.querySelector(newTabPanel).setAttribute("tabindex", "0");

    //add new tab to storage
    currentTabs.push(newTabPanel);
    localStorage.setItem(juis.tabList.storageIndex, currentTabs.join());

    //prevent hash change
    event.preventDefault();
    return false;

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
