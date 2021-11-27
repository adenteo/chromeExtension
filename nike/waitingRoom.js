var openRoom = setInterval(function(){ 
    var timeNow = new Date();
    if(timeNow.getHours() >= 9 && timeNow.getMinutes() >= 58){
        chrome.storage.local.get({nikeCheckoutlink:""},function(link) {
            // document.getElementById("link").innerHTML = link.nikeCheckoutlink
            var earlyLink = link.nikeCheckoutlink
            window.location.href = "https://www.nike.com/sg/launch?s=upcoming"
            var myWindow = window.open(earlyLink,'_blank');
            clearInterval(openRoom);
        })        

 

}}, 1000);

chrome.storage.local.get({nikeHour:"",nikeMinute:"",nikeSecond:"",nikeMillisecond:"",nikeCheckoutlink:""},function(details) {
    var earlyLink = details.nikeCheckoutlink
    document.getElementById("link").innerHTML = earlyLink


})        