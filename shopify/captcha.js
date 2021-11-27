
chrome.storage.local.get({autoCaptcha:"",shopifyEnabled:""}, function(details) {
  if (details.autoCaptcha == true && details.shopifyEnabled == true) {
    console.log("CAPTCHA DETECTED")
    document.getElementById("recaptcha-anchor-label").click()
  }

})

console.log("HELLO")