//counts the number of profiles created


document.getElementById("save-profile").addEventListener("click",saveProfile)
function saveProfile()  {
    chrome.storage.local.get(null,function(data) {
        console.log(data)
        var profilesCreatedToDate = data['objectCount']
        if (profilesCreatedToDate != undefined) {
            var profileId = profilesCreatedToDate + 1
            var obj = {}
            obj["profile" + profileId] = {'profileId':('profile' + profileId),'profileName':profileName.value,'fName':fName.value,'lName':lName.value,'email':email.value,'phone':phone.value,'add1':add1.value,'add2':add2.value,'city':city.value,'country':country.value,'state':state.value,'postal':postal.value,'cardName':cardName.value,'cardNumber':cardNumber.value,'expMonth':expMonth.value,'expYear':expYear.value,'cvv':cvv.value}
            chrome.storage.local.set(obj)
            chrome.storage.local.set({'objectCount': profileId})
            window.top.location.reload();
        } else {
            var obj = {}
            obj["profile1"] = {'profileId':'profile1','profileName':profileName.value,'fName':fName.value,'lName':lName.value,'email':email.value,'phone':phone.value,'add1':add1.value,'add2':add2.value,'city':city.value,'country':country.value,'state':state.value,'postal':postal.value,'cardName':cardName.value,'cardNumber':cardNumber.value,'expMonth':expMonth.value,'expYear':expYear.value,'cvv':cvv.value}
            chrome.storage.local.set(obj)
            chrome.storage.local.set({'objectCount': 1})
            window.top.location.reload();
        }
        // for (var key in data) {
        //     if (key.includes("profile")) {
        //         profileCount += 1
        //     }
        // }
        // var obj = {}
        // var profileId = profileCount + 1
        // chrome.storage.local.set({'objectCount':profileId})
        // obj["profile" + profileId] = {'profileName':profileName.value,'fName':fName.value,'lName':lName.value,'email':email.value,'phone':phone.value,'add1':add1.value,'add2':add2.value,'city':city.value,'country':country.value,'state':state.value,'postal':postal.value,'cardNumber':cardNumber.value,'expMonth':expMonth.value,'expYear':expYear.value,'cvv':cvv.value}
        // chrome.storage.local.set(obj)
      
    })


}

