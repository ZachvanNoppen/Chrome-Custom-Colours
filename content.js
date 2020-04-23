
let pallete = {
  init: function(){
    console.log("initialising the coulours");
    //setting the colours from memory
  },
  setPalleteColours: function(){
    let URL = window.location.href;
    chrome.storage.sync.get([URL], function(result) {
          console.log('Value is:');
          console.log(result);
        });

  },
  savePalleteColours: function(){
    //Saving all the current data to the local storage
    let URL = window.location.href;
    console.log(URL);
    let preferences = {
      url: URL,
      colours: this.COLOURS,
      //Optional for later
      ///primaryItems: {},
      ///secondaryItems: {},
      //tertiaryItems: {},
    };
    //Generate a unique key for URL later
    chrome.storage.sync.set({[URL]: preferences}, function() {
          console.log("saved");
        });
  },
  printColours: function(){
    console.log(COLOURS);
  },
  COLOURS: {
    primary: "grey",
    secondary: "orange",
    tertiary: "white",
    selection_1: "red",
  },
  getPrimary: function(){
    let body = document.getElementsByTagName("body");
    let articles = document.getElementsByTagName("article");
    let asides = document.getElementsByTagName("aside");
    let divs = document.getElementsByTagName("div");
    let sections = document.getElementsByTagName("section");

    return [body, articles, asides, divs, sections];
  },
  getSecondary: function(){
    let buttons = document.getElementsByTagName("button");
    let header = document.getElementsByTagName("h1");
    let header2 = document.getElementsByTagName("h2");
    let header3 = document.getElementsByTagName("h3");
    let header4 = document.getElementsByTagName("h4");
    let header5 = document.getElementsByTagName("h5");
    let header6 = document.getElementsByTagName("h6");
    let bolds = document.getElementsByTagName("b");
    let links = document.getElementsByTagName("a");
    let nav = document.getElementsByTagName("nav");

    return [
      buttons,
      header,
      header2,
      header3,
      header4,
      header5,
      header6,
      bolds,
      links,
      nav
    ];
  },
  getTertiary: function(){
    let paragraphs = document.getElementsByTagName("p");
    let labels = document.getElementsByTagName("label");
    let listItems = document.getElementsByTagName("li");
    let captions = document.getElementsByTagName("caption");

    return [paragraphs, labels, listItems, captions];
  },
  updateColours: function(items, colour){
    items.forEach(item => {
      if (item.length != 0) {
        for (let i = 0; i < item.length; i++) {
          if (colour == pallete.COLOURS.primary) {
            if(!item[i].classList.contains("interface") ){
              item[i].setAttribute("style","background-color: " + colour + " !important");
            }
          } else {
            if(!item[i].classList.contains("interface") ){
              item[i].setAttribute("style", "color: " + colour + " !important");
            }
          }
        }
      }
    });
  },

};

let interface = {
  init: function(){
    this.displayUI();
    this.events();
  },
  events: function(){
    //Adding the drop down functionality
    let coll = document.getElementById("collapse");
    coll.addEventListener("click", function() {
      this.classList.toggle("active");

      var content = this.previousElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  },
  setPageStyles: function(){},
  displayUI: function(){
    //Getting the location of the assets
    let assetLocation = chrome.extension.getURL("/assets/");
    let menu = document.createElement("input");
    menu.id = "collapse";
    menu.type = "image";
    menu.src = assetLocation + "arrow.svg";
    menu.className = "menu ";
    menu.className += "interface";
    ///Menu Section
    let menuContent = document.createElement("div");
    menuContent.classList.add('menuContent', 'interface');
    //Text Content
    let p = document.createElement("p");
    p.classList.add('interface');
    p.style.margin = "0px";
    p.textContent = "This is where all of the content will go";

    //Adding everything
    menuContent.appendChild(p);
    let content = document.getElementsByTagName("body")[0];
    content.insertBefore(menu, content.firstChild);
    content.insertBefore(menuContent, menu);
  }
};

//THese are temporary functions

function renderPage(interface, pallete) {
  pallete.updateColours(pallete.getPrimary(), pallete.COLOURS.primary);
  pallete.updateColours(pallete.getSecondary(), pallete.COLOURS.secondary);
  pallete.updateColours(pallete.getTertiary(), pallete.COLOURS.tertiary);
}

function printAllData(file){
  chrome.storage.sync.get(null, function(result) {
    console.log('All data: ');
    console.log(result);
    });

}
//
//
interface.init();
renderPage(interface, pallete);

printAllData();
printAllData();

pallete.savePalleteColours();
pallete.setPalleteColours();
