$("#homepage").click(function() {
    window.open("../popupMain.html","_self")
})


chrome.storage.local.get(null,function(settings) {
    if (settings.autoCaptcha == true) {
        document.getElementById("captcha").click()
    }
    if (settings.autoATC == true) {
        document.getElementById("autoatc").click()
    }
    if (settings.autopay == true) {
        document.getElementById("autopay").click()
    }
})


$("#captcha").click(function() {
    var toggled = $(this).is(":checked")
    if (toggled == true) {
        chrome.storage.local.set({'autoCaptcha':true})
    } else {
        chrome.storage.local.set({'autoCaptcha':false})
    }
   
})

$("#autoatc").click(function() {
    var toggled = $(this).is(":checked")
    if (toggled == true) {
        chrome.storage.local.set({'autoATC':true})
    } else {
        chrome.storage.local.set({'autoATC':false})
    }

})

$("#autopay").click(function() {
    var toggled = $(this).is(":checked")
    if (toggled == true) {
        chrome.storage.local.set({'autopay':true})
    } else {
        chrome.storage.local.set({'autopay':false})
    }
    
})