var change = new Event('input',[{
    bubbles: true, cancelable: true
}]);



chrome.storage.local.get(null,function(details) {
    setTimeout(function() {
        var profileId = details.IdSelected
        var profileDetails = details[profileId]
        var cardNumber = profileDetails['cardNumber']
        var cardNumberModified = cardNumber.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/,'')
        $("#cardNumber-input").val(cardNumberModified)
        document.getElementById("cardNumber-input").dispatchEvent(change)
        $("#cardExpiry-input").val(profileDetails['expMonth'] + " / " + profileDetails['expYear'].substring(2))
        document.getElementById("cardExpiry-input").dispatchEvent(change)
        $("#cardCvc-input").val(profileDetails['cvv'])
        document.getElementById("cardCvc-input").dispatchEvent(change)
        var cardField = document.getElementById("cardNumber-input").value
    },500)
       
    })
   
