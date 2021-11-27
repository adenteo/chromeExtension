$('#homepage').click(function(){
    window.open("../popupMain.html","_self")
})


chrome.storage.local.get(null,function(settings) {
    if (settings.adidasAutoATC == true) {
        document.getElementById("autoatc").click()
    }
    if (settings.adidasAutopay == true) {
        document.getElementById("autopay").click()
    }
    

})

chrome.storage.local.get({adidasSku:""},function(sku) {
    var userSku = document.getElementById("adidasSku")
    userSku.value = sku.adidasSku
})


$("#autoatc").click(function() {
    var toggled = $(this).is(":checked")
    if (toggled == true) {
        chrome.storage.local.set({'adidasAutoATC':true})
    } else {
        chrome.storage.local.set({'adidasAutoATC':false})
    }

})

$("#autopay").click(function() {
    var toggled = $(this).is(":checked")
    if (toggled == true) {
        chrome.storage.local.set({'adidasAutopay':true})
    } else {
        chrome.storage.local.set({'adidasAutopay':false})
    }
    
})

$("#saveSku").click(function() {
    var userSku = document.getElementById("adidasSku").value
    chrome.storage.local.set({'adidasSku':userSku})
    document.getElementById("saveSku").innerHTML = 'Saved  <i class="fas fa-check-circle"></i>'

})