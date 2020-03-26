let pallete = {
  primary: "grey",
  secondary: "orange",
  tertiary: "white",
  selection_1: "red"
};

function getPrimary() {
  let body = document.getElementsByTagName("body");
  let articles = document.getElementsByTagName("article");
  let asides = document.getElementsByTagName("aside");
  let divs = document.getElementsByTagName("div");
  let sections = document.getElementsByTagName("section");

  return [body, articles, asides, document, divs, sections];
}

function getSecondary() {
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
}

function getTertiary() {
  let paragraphs = document.getElementsByTagName("p");
  let labels = document.getElementsByTagName("label");
  let listItems = document.getElementsByTagName("li");
  let captions = document.getElementsByTagName("caption");

  return [paragraphs, labels, listItems, captions];
}

function updateColours(items, colour) {
  items.forEach(item => {
    if (item.length != 0) {
      for (let i = 0; i < item.length; i++) {
        if (colour == pallete.primary) {
          item[i].setAttribute(
            "style",
            "background-color: " + colour + " !important"
          );
        } else {
          item[i].setAttribute("style", "color: " + colour + " !important");
        }
      }
    }
  });
}

function renderPage() {
  updateColours(getPrimary(), pallete.primary);
  updateColours(getSecondary(), pallete.secondary);
  updateColours(getTertiary(), pallete.tertiary);
}

function displayUI() {
  //Getting the location of the assets
  let assetLocation = chrome.extension.getURL("/assets/");
  let menu = document.createElement("input");
  menu.id = "collapse";
  menu.type = "image";
  menu.src = assetLocation + "arrow.svg";
  menu.style =
    "position: fixed;" +
    "right: 20px;" +
    "top: 0px;" +
    "height:30px;" +
    "width: 30px;";

  let menuContent = document.createElement("div");
  menuContent.style =
    " position: fixed;" +
    "display:none;" +
    "background-color:white;" +
    "top: 0;" +
    "width: 100%;" +
    "height: 100px;";
  menuContent.innerHTML =
    "<p style='margin: 0px;'>" +
    "This is where all of the content will go" +
    "</p>" +
    "<button>Primary Colour Picker</button>" +
    "<button>Secondary Colour Picker</button>" +
    "<button>Tertiary Colour Picker</button>";
  let content = document.getElementsByTagName("body")[0];
  content.insertBefore(menu, content.firstChild);
  content.insertBefore(menuContent, menu);
}

//Page Styling
//100px hard coded is temp
var style = document.createElement("style");
style.innerHTML = `
  .active {
  margin-top: 130px;
  }
  `;
document.head.appendChild(style);

//
//
renderPage();
displayUI();
startListeners();

//Event Listeners
function startListeners() {
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
}
