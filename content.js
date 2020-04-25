
//Creating an object to manipulate our page

let pallete = {
  init: function(){
    console.log("initialising the coulours");
    //setting the colours from memory

  },
  COLOURS: {
    primary: null,
    secondary: null,
    tertiary: null,
    selection_1: null ,
  },
  setColour: function(newColours) {
    if(newColours.type == "primary"){
      this.COLOURS.primary = "rgba("+newColours.colour.r+", "+newColours.colour.g+", "+newColours.colour.b+"0, "+newColours.colour.a+");"
    }else if(newColours.type == "secondary"){
      this.COLOURS.secondary = "rgba("+newColours.colour.r+", "+newColours.colour.g+", "+newColours.colour.b+"0, "+newColours.colour.a+");"
    }else if(newColours.type == "tertiary"){
      this.COLOURS.tertiary = "rgba("+newColours.colour.r+", "+newColours.colour.g+", "+newColours.colour.b+"0, "+newColours.colour.a+");"
    }else{

    }

  },
  setPalleteColours: function(){
    let self = this;
    let URL = window.location.href;
    chrome.storage.sync.get([URL], function(result) {
          console.log('Value is:');
          console.log(result);

          self.COLOURS = result[URL].colours;
          console.log(self.COLOURS);
          console.log("ASDF");
          if(self.COLOURS.primary != null ){
            console.log(self.COLOURS.primary);
            self.updateColours(self.getPrimary(), self.COLOURS.primary);
          }
          if(self.COLOURS.secondary != null){
            self.updateColours(self.getSecondary(), self.COLOURS.secondary);
          }
          if(self.COLOURS.tertiary != null){
            self.updateColours(self.getTertiary(), self.COLOURS.tertiary);
          }
        });

        renderPage(self);
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
          console.log(preferences);
        });
  },
  printColours: function(){
    console.log(this.COLOURS);
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
          console.log("ssss");
          if (colour == this.COLOURS.primary) {
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
  resetColours: function(items){
    items.forEach(item => {
      if (item.length != 0) {
        for (let i = 0; i < item.length; i++) {
          item[i].setAttribute("style","");
        }
      }
    });
  },

};

//THese are temporary functions

pallete.setPalleteColours();

function renderPage(pallete) {
  pallete.updateColours(pallete.getPrimary(), pallete.COLOURS.primary);
  pallete.updateColours(pallete.getSecondary(), pallete.COLOURS.secondary);
  pallete.updateColours(pallete.getTertiary(), pallete.COLOURS.tertiary);
}

function printAllData(){
  chrome.storage.sync.get(null, function(result) {
    console.log('All data: ');
    console.log(result);
    });

}


function resetColours(){
  pallete.resetColours(pallete.getPrimary());
  pallete.resetColours(pallete.getSecondary());
  pallete.resetColours(pallete.getTertiary());
}


//Saving the colours that have been sent
function saveChanges(){
  pallete.savePalleteColours();
  console.log("Saved");
  printAllData();
}


//Listening for any commands from the UI
chrome.runtime.onMessage.addListener(
  function(data, sender, sendResponse) {

      console.log(data);
      //Send a message to the content.js file, if not successful send errchrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      sendResponse({msg: "DONE", err: null});
      if(data.type == "save"){
        console.log("Here");
        pallete.savePalleteColours();
      }else if(data.type == "reset"){
        resetColours();
      }
      else{
        console.log("d: " + data.type);
        pallete.setColour(data);
        renderPage(pallete);
      }

});
