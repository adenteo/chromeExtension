var change = new Event('input',[{
    bubbles: true, cancelable: true
}]);

chrome.storage.local.get(null,function(details) {
    if (details.shopifyEnabled == true) {
        var profileId = details.IdSelected
        var profileDetails = details[profileId]
        var address2 = profileDetails['add2']
        console.log(address2.substring(1))
        $('#CheckoutData_BillingFirstName').val(profileDetails['fName'])
        $('#CheckoutData_BillingLastName').val(profileDetails['lName'])
        $('#CheckoutData_Email').val(profileDetails['email'])
        $('#CheckoutData_BillingAddress1').val(profileDetails['add1'])
        $('#CheckoutData_BillingAddress2').val("Unit " + address2.substring(1))
        $('#BillingCity').val(profileDetails['city'])
        $('#BillingZIP').val(profileDetails['postal'])
        $('#CheckoutData_BillingPhone').val(profileDetails['phone'])
        $("input[name*='OffersFromMerchant']")[0].click()
    }
   
    
})

