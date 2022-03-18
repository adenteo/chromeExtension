chrome.storage.local.get({shopifyEnabled:""},function(check) {
  if (check.shopifyEnabled == true) {
    var currentUrl = window.location.href
    var pageOrigin = window.location.origin

    // fill in contact and shipping information
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.captchaSolved == true) {
            setTimeout(function(){document.getElementById("continue_button").click();},200); 
          }
          return true;
        }
      );

    chrome.storage.local.get(null,function(details) {
        var profileId = details.IdSelected
        var profileDetails = details[profileId]
        $("#checkout_email").val(profileDetails['email'])
        $("#checkout_shipping_address_first_name").val(profileDetails['fName'])
        $("#checkout_shipping_address_last_name").val(profileDetails['lName'])
        $("#checkout_shipping_address_address1").val(profileDetails['add1'])
        $("#checkout_shipping_address_address2").val(profileDetails['add2'])
        $("#checkout_shipping_address_city").val(profileDetails['city'])
        $("#checkout_shipping_address_country").val(profileDetails['country'])
        $("#checkout_shipping_address_zip").val(profileDetails['postal'])
        $("#checkout_shipping_address_phone").val(profileDetails['phone'])
        //submit discount code
        fetch(currentUrl, {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrerPolicy": "origin",
          "body": "_method=patch&step=contact_information&checkout%5Breduction_code%5D=" + details['code'],
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })

        // check if captcha present
        
        var submitButton = document.getElementById("continue_button")
        var submitButtonLabel = document.querySelector("#continue_button > span").innerHTML
        console.log(submitButtonLabel)
        if (document.getElementById("g-recaptcha") == null && submitButtonLabel == "Continue to shipping") {
            setTimeout(function(){document.getElementById("continue_button").click();},150)
            console.log("SUBMITTING")
        }
    })

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          console.log("RECEIVED TWO")
          if (request.shippingLoaded == true) {
            console.log("CLICKING TWO")
            document.getElementById("continue_button").click()
            return true;
          }
        }
        
      );






chrome.storage.local.get(null,function(details) {
  var checkoutPrice = $('.payment-due__price.skeleton-while-loading--lg')
  console.log(checkoutPrice[0].innerText)
  if (currentUrl.includes("step=payment_method") && details.autopay == true && checkoutPrice[0].innerText != "$100,000.00") {
    fetch(currentUrl, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrerPolicy": "origin",
      "body": "_method=patch&step=contact_information&checkout%5Breduction_code%5D=" + details['code'],
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    })
    $('[id*=payment-gateway-subfields]').remove()
    var profileId = details.IdSelected
    var profileDetails = details[profileId]
    var paymentGateway = $('[data-gateway-name=credit_card').attr('data-select-gateway')
    var authToken = $('input[name="authenticity_token"]').attr("value")
    var formatAuthToken = encodeURIComponent(authToken)
    var paymentPrice = $("#checkout_total_price").attr("value")
    var submitButton = document.getElementById("continue_button")
    var submitButtonLabel = document.querySelector("#continue_button > span").innerHTML
    submitButton.innerHTML = "Doing magic..."
    fetch("https://deposit.us.shopifycs.com/sessions", {
    "headers": {
      "accept": "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site"
    },
    "referrer": "https://checkout.shopifycs.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"credit_card\":{\"number\":\""+ profileDetails['cardNumber'] +"\",\"name\":\"" + profileDetails['cardName'] +"\",\"month\":"+ Number(profileDetails['expMonth']) +",\"year\":"+ profileDetails['expYear']+",\"verification_value\":\""+ profileDetails['cvv'] +"\"},\"payment_session_scope\":\"" + pageOrigin + "\"}",
    "method": "POST",
    "mode": "cors"
  }).then(response => {
    return response.json()
  }).then(data => {
    var paymentToken = data["id"]
    submitOrder(paymentGateway,formatAuthToken,paymentToken,paymentPrice)
  });

  } else {
    console.log("DISCOUNT NOT APPLIED")
  }
  
})



function submitOrder(paymentGateway,formatAuthToken,paymentToken,paymentPrice) {
  var submitUrl = location.protocol + '//' + location.host + location.pathname
  console.log("SUBMITTING ORDER...")
  fetch(submitUrl, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    "referrer": "https://limitededt.com/",
    "referrerPolicy": "origin",
    "body": "_method=patch&authenticity_token="+ formatAuthToken + "&previous_step=payment_method&step=&s="+ paymentToken +"&checkout%5Bpayment_gateway%5D="+ paymentGateway +"&checkout%5Bcredit_card%5D%5Bvault%5D=false&checkout%5Bdifferent_billing_address%5D=false&checkout%5Bremember_me%5D=false&checkout%5Bremember_me%5D=0&checkout%5Bvault_phone%5D=&checkout%5Btotal_price%5D="+ paymentPrice +"&complete=1&checkout%5Bclient_details%5D%5Bbrowser_width%5D=924&checkout%5Bclient_details%5D%5Bbrowser_height%5D=969&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-480",
    "method": "POST",
    "mode": "cors"
  }).then(response => {
    console.log(response.url)
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
  
}
  }
})


