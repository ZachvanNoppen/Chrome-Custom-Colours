
/*
This code is a relay between the content.js page and wheel.js.
Since the UI is rendered in the page action of the page, it has no direct contact with the website itself.
This code relays messages from the UI to the main page
*/

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //Send a message to the content.js file
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
        if(response){
          //If there is a response, print it
          console.log(response);
        }
    });
  });
});
