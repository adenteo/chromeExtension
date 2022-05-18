

chrome.storage.local.get(null,function(details) {
    if (details.shopifyEnabled == true) {
        var profileId = details.IdSelected
        var profileDetails = details[profileId]
        $('#cardNum').val(profileDetails['cardNumber'])
        $('#cardExpiryMonth').val(Number(profileDetails['expMonth']))
        $('#cardExpiryMonth').trigger("change")
        $('#cardExpiryYear').val(profileDetails['expYear'])
        $('#cardExpiryYear').trigger("change")
        $('#cvdNumber').val(profileDetails['cvv'])    
    }

    
})

//test comment
