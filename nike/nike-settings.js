$('#homepage').click(function(){
    window.open("../popupMain.html","_self")
})



chrome.storage.local.get({nikeHour:"",nikeMinute:"",nikeSecond:"",nikeMillisecond:"",nikeCheckoutlink:""},function(timing) {
    console.log(timing.nikeHour)
    document.getElementById("hour").value = timing.nikeHour
    document.getElementById("minute").value = timing.nikeMinute
    document.getElementById("second").value = timing.nikeSecond
    document.getElementById("millisecond").value = timing.nikeMillisecond
    document.getElementById("checkoutLink").value = timing.nikeCheckoutlink
})

$('#clearToken').click(function(){
    chrome.storage.local.remove(['formdata'])
    chrome.storage.local.set({'productResultApiList':[]})
    window.open("nike-settings.html","_self")
})

$('#saveButton').click(function() {
    var hour = document.getElementById("hour").value
    var minute = document.getElementById("minute").value
    var second = document.getElementById("second").value
    var millisecond = document.getElementById("millisecond").value
    var link = document.getElementById("checkoutLink").value
    chrome.storage.local.set({'nikeHour':hour,'nikeMinute':minute,'nikeSecond':second,'nikeMillisecond':millisecond,'nikeCheckoutlink':link})
    document.getElementById("saveButtonName").style.opacity = "0"
    document.getElementById("savedNotification").style.opacity = "1"
    document.getElementById("savedNotification").style.transition = "0.3s"
    document.getElementById("savedNotification").style.transform = "translateX(-43px)"
})


$('#generateButton').click(function() {
    var link = document.getElementById("checkoutLink").value
    window.open(link)
    window.focus()
})


chrome.storage.local.get({'formdata':[]}, function(data) {
    var entryData  = JSON.stringify(data.formdata)
    if (entryData != "[]") {
        var tokenCount = data.formdata.length
        document.getElementById("launchId").innerHTML = "&nbsp;" + tokenCount
        for (var i=0;i<tokenCount;i++) {
            var tokenContent = JSON.parse(data.formdata[i])['launchId']
            $('#tokens').append("<h5>" + tokenContent + "</h5>")
        }
    } else {
        document.getElementById("launchId").innerHTML = " 0"
    }
    
})