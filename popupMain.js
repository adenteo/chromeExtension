//creates profile overlay content
chrome.storage.local.get(null,function(profile) {
    for (var key in profile) {
        if (key.includes("profile")) {
            var profileName = profile[key]['profileName']
            var profileId = profile[key]['profileId']
            var profileScrollContent = '<h1 id=' + profileId +'>' + profileName + '</h1>'
            $(".overlay-content").append(profileScrollContent)
        }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    }
})


//displays the profile selected
chrome.storage.local.get(null, function(profile) {
    for (var key in profile) {
        if (key.includes("profile")) {
            var profileName = profile[key]['profileName']
            if (profileName == profile['selected']) {
                $("#profileDisplay").html(profile['selected'])
                return
            } 
        }}
   chrome.storage.local.remove('selected')
})


     

chrome.storage.local.get({shopifyEnabled:"",adidasEnabled:"",nikeEnabled:""},function(toggle) {
    if (toggle.shopifyEnabled == true) {
        $("#shopifyCheckbox").click()
    }
    if (toggle.adidasEnabled == true) {
        $("#adidasCheckbox").click()
    }
    if (toggle.nikeEnabled == true) {
        $("#nikeCheckbox").click()
    }
})


//CLICKABLE EVENTS

document.getElementById("profileListBtn").addEventListener("click",openProfileList);
function openProfileList() {
    document.getElementById("profileOverlay").style.height = "100%"
}


document.getElementById("closeProfileListBtn").addEventListener("click",closeProfileList);
function closeProfileList() {
    document.getElementById("profileOverlay").style.height = "0%"
}

document.getElementById("editProfiles").addEventListener("click",profilePage);
function profilePage() {
    window.open("/profilePage.html","_blank")
}


$(".overlay-content").on("click","h1",function() {
    var selectedProfile = $(this).text()
    var profileId = $(this).attr("id")
    $("#profileDisplay").html(selectedProfile)
    chrome.storage.local.set({'selected':selectedProfile,'IdSelected':profileId})
    document.getElementById("profileOverlay").style.height = "0%"
})


$(".shopifyMonitor").click(function() {
    window.open("shopify/shopify-monitor.html","_self")
})


$("#shopifyCheckbox").click(function() {
    var toggleOn = $(this).is(":checked")
    console.log(toggleOn)
    if (toggleOn == true) {
        chrome.storage.local.set({"shopifyEnabled": true})
    } else {
        chrome.storage.local.set({"shopifyEnabled": false})
    }
    
})




$("#adidasCheckbox").click(function() {
    var toggleOn = $(this).is(":checked")
    console.log(toggleOn)
    if (toggleOn == true) {
        chrome.storage.local.set({"adidasEnabled": true})
    } else {
        chrome.storage.local.set({"adidasEnabled": false})
    }
})


$("#nikeCheckbox").click(function() {
    var toggleOn = $(this).is(":checked")
    console.log(toggleOn)
    if (toggleOn == true) {
        chrome.storage.local.set({"nikeEnabled": true})
    } else {
        chrome.storage.local.set({"nikeEnabled": false})
    }
})


$("#shopify-settings").click(function() {
    window.open("shopify/shopify-settings.html","_self")
})


$("#adidas-settings").click(function() {
    window.open("adidas/adidas-settings.html","_self")
})


$(".discountCode").click(function() {
    window.open("shopify/shopify-discount.html","_self")
})

$("#nike-settings").click(function() {
    window.open("nike/nike-settings.html","_self")
})

$('#waitingRoom').click(function() {
    chrome.storage.local.get({nikeCheckoutlink:''},function(insertLink) {
        var earlyLink = insertLink.nikeCheckoutlink
        var waitingRoom = window.open("/nike/waitingRoom.html","_blank");
        // waitingRoom.document.write('<script src="/nike/waitingRoom.js"></script><body style="background:#292929;color:white;"><p style="color:white" id="link">' + earlyLink + '</p><h1 align="center">You will be redirected to the checkout page shortly before the checkout timing.</h1><h2 align="center" id="countdown"></h2></body>')
      })
})


$('#productList').click(function() {
    window.open("/nike/productList.html","_blank")
})

$('#configuration').click(function() {
    window.open("configuration.html","_self")
})