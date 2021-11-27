chrome.storage.local.get({shopifyEnabled:""},function(details) {
  if (details.shopifyEnabled == true) {
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.captchaSolved == true)
         setTimeout(function(){document.getElementsByClassName("ui-button ui-button--primary btn")[0].click();},100); 
      }
    );  
  }
})
