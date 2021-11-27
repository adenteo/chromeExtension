$("#saveButton").click(function(){
    $(this).html('Saved <i class="fas fa-check-circle"></i>')
    var webhook = document.getElementById("webhook").value
    chrome.storage.local.set({'webhook':webhook})
})

$("#homepage").click(function(){
    window.open("../popupMain.html","_self")
})


chrome.storage.local.get({webhook:""},function(details) {
    document.getElementById("webhook").value = details.webhook
})