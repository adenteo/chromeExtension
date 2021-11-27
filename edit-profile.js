// chrome.storage.local.clear()
var profileLink = window.location.search
const urlParams = new URLSearchParams(profileLink);
const profileNumber = urlParams.get("id")
var tryThis = JSON.stringify(profileNumber)



chrome.storage.local.get(null,function(profile) {
    var profileData = profile[profileNumber]
    profileName.value = profileData['profileName']
    fName.value = profileData['fName']
    lName.value = profileData['lName']
    email.value = profileData['email']
    phone.value = profileData['phone']
    add1.value = profileData['add1']
    add2.value = profileData['add2']
    city.value = profileData['city']
    country.value = profileData['country']
    state.value = profileData['state']
    postal.value = profileData['postal']
    cardName.value = profileData['cardName']
    cardNumber.value = profileData['cardNumber']
    expMonth.value = profileData['expMonth']
    expYear.value = profileData['expYear']
    cvv.value = profileData['cvv']
    
})

//CLICKABLE EVENTS

document.getElementById("save-profile").addEventListener("click",saveProfile)
function saveProfile(){
    var obj = {}
    obj[profileNumber] = {'profileId':profileNumber,'profileName':profileName.value,'fName':fName.value,'lName':lName.value,'email':email.value,'phone':phone.value,'add1':add1.value,'add2':add2.value,'city':city.value,'country':country.value,'state':state.value,'postal':postal.value,'cardName':cardName.value,'cardNumber':cardNumber.value,'expMonth':expMonth.value,'expYear':expYear.value,'cvv':cvv.value}
    chrome.storage.local.set(obj)
    window.top.location.reload();
}



$("#delete-profile").click(function() {
    chrome.storage.local.get(null,function(profile) {
        var obj = {}
        obj[profileNumber] = profile[profileNumber]
        console.log(obj)
        console.log(Object.keys(obj)[0])
        chrome.storage.local.remove(Object.keys(obj)[0])
        window.top.location.reload();
    })

 
})