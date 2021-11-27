var triggerChange = new Event('input', {
    bubbles: true,
    cancelable: true,
  });

chrome.storage.local.get(null,function(address) {
    if (address.adidasEnabled == true) {
        console.log("ACTIVE")
        var profileId = address.IdSelected
        var profileDetails = address[profileId]
        $("#dwfrm_shipping_email_emailAddress").val(profileDetails['email'])
        document.getElementById("dwfrm_shipping_email_emailAddress").dispatchEvent(triggerChange)
        $("#dwfrm_shipping_shiptoaddress_shippingAddress_firstName").val(profileDetails['fName'])
        document.getElementById("dwfrm_shipping_shiptoaddress_shippingAddress_firstName").dispatchEvent(triggerChange)
        $("#dwfrm_shipping_shiptoaddress_shippingAddress_lastName").val(profileDetails['lName'])
        document.getElementById("dwfrm_shipping_shiptoaddress_shippingAddress_lastName").dispatchEvent(triggerChange)
        $("#dwfrm_shipping_shiptoaddress_shippingAddress_address1").val(profileDetails['add1'])
        document.getElementById("dwfrm_shipping_shiptoaddress_shippingAddress_address1").dispatchEvent(triggerChange)
        $("#dwfrm_shipping_shiptoaddress_shippingAddress_address2").val(profileDetails['add2'])
        document.getElementById("dwfrm_shipping_shiptoaddress_shippingAddress_address2").dispatchEvent(triggerChange)
        $("#dwfrm_shipping_shiptoaddress_shippingAddress_postalCode").val(profileDetails['postal'])
        document.getElementById("dwfrm_shipping_shiptoaddress_shippingAddress_postalCode").dispatchEvent(triggerChange)
        $("#dwfrm_shipping_shiptoaddress_shippingAddress_phone").val("+65 " + profileDetails['phone'])
        document.getElementById("dwfrm_shipping_shiptoaddress_shippingAddress_phone").dispatchEvent(triggerChange)
    
        $("button[name='dwfrm_shipping_submitshiptoaddress']").click()
   
      
    }
   

})