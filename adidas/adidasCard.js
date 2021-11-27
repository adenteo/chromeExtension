


var triggerChange = new Event('input', {
    bubbles: true,
    cancelable: true,
  });

chrome.storage.local.get(null,function(details) {
    if (details.adidasEnabled == true) {
        var profileId = details.IdSelected
        var profileDetails = details[profileId]
        $("[id*='dwfrm_adyenencrypted_number']").val(profileDetails['cardNumber'])
        $("#dwfrm_adyenencrypted_holderName").val(profileDetails['cardName'])
        document.querySelector("[data-ci-test-id='cardNumberField']").dispatchEvent(triggerChange)
        cardMonth = document.querySelector("[data-value='" + profileDetails.expMonth +"']")
        cardMonth.click()
        cardYear = document.querySelector("[data-value='"+ profileDetails.expYear +"']")
        cardYear.click()
        $("#dwfrm_adyenencrypted_cvc").val(profileDetails['cvv'])
        document.getElementById("dwfrm_adyenencrypted_cvc").dispatchEvent(triggerChange)

        if (details.adidasAutoPay == true) {
            document.querySelector("#content > div > div.payment-section.col-8 > div.outer-payment-submit.stylerefresh > div > button").click()
        }
  
    }
})

