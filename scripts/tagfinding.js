/*
Zachary van Noppen 
2019


*/

//Turn this into JSON object eventually
let pallet = {
  primary: "grey",
  secondary: "green",
  tertiary: "yellow",
  selection_1: "red"
};

function getPrimary() {
  let body = document.getElementsByTagName("body")[0];
  let articles = document.getElementsByTagName("article");
  let asides = document.getElementsByTagName("aside");
  let divs = document.getElementsByTagName("div");
  let sections = document.getElementsByTagName("section");

  return [articles, asides, document, divs, sections];
}

function alterPrimary() {
  let items = getPrimary();

  body.style.backgroundColour = pallet.primary;

  items.forEach(item => {
    if (item != undefined) {
      item.forEach(tag => {
        tag.style.backgroundColour = pallet.primary;
      });
    }
  });
}

function renderPage() {
  alterPrimary();
}
