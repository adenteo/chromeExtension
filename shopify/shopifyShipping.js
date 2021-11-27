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

// fetch("https://limitededt.com/9952329785/checkouts/6b1e01c2398426030a1de7ac74ca69b9", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-GB,en;q=0.9",
//     "cache-control": "max-age=0",
//     "content-type": "application/x-www-form-urlencoded",
//     "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-fetch-dest": "document",
//     "sec-fetch-mode": "navigate",
//     "sec-fetch-site": "same-origin",
//     "sec-fetch-user": "?1",
//     "upgrade-insecure-requests": "1",
//     "cookie": "checkout=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVUyTURkaE1ETmtNR1EyTWpVMU1XTXdaVEEyWmpaa056TTNZMkZpTVRBeU1BWTZCa1ZVIiwiZXhwIjoiMjAyMS0wNC0wOVQxNToxNDoxMy4zNDRaIiwicHVyIjoiY29va2llLmNoZWNrb3V0In19--c68d1ca0e21af91f559d7d0f9a262e5bd2ea326f; tracked_start_checkout=6b1e01c2398426030a1de7ac74ca69b9; checkout_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVUyWWpGbE1ERmpNak01T0RReU5qQXpNR0V4WkdVM1lXTTNOR05oTmpsaU9RWTZCa1ZVIiwiZXhwIjoiMjAyMi0wMy0xOVQxNToxNDoxMy4zNDRaIiwicHVyIjoiY29va2llLmNoZWNrb3V0X3Rva2VuIn19--38dbf1888bcf7dbd8e6e3598222a4e027b2f81bb; secure_customer_sig=; _shopify_country=Singapore; cart_currency=SGD; _orig_referrer=; _landing_page=%2F; _y=4b7f3e1c-21da-427e-9e4b-d9ed20efaf3d; _s=f203caf7-8111-4131-a7f1-dc2d162bae32; _shopify_y=4b7f3e1c-21da-427e-9e4b-d9ed20efaf3d; _shopify_s=f203caf7-8111-4131-a7f1-dc2d162bae32; _shopify_fs=2021-03-19T15%3A13%3A37Z; _shopify_sa_p=; _ga=GA1.2.1991856376.1616166816; _gid=GA1.2.1286893022.1616166816; _fbp=fb.1.1616166816047.412024206; shopify_pay_redirect=pending; soundestID=20210319151336-xjIEPhIfWUHKNyTO5fY307m1Mug6PpbFR5nX6ZFhmrzterHSb; omnisendAnonymousID=12EARTeOAwiGDs-20210319151336; omnisendSessionID=AnfXtz8FGrCdFY-20210319151336; coin-currency=SGD; intercom-id-la3i4bs0=b50a0db7-2eb7-4255-b337-addc692b0f4a; intercom-session-la3i4bs0=; soundest-views=3; cart=0c8085b9ac4bf93f5c644c8762dea0cf; dynamic_checkout_shown_on_cart=1; cart_ts=1616166831; cart_sig=5aa60bb2f554ad2fd0b377cbce6043d7; _secure_session_id=23a0b328f75dd6ccd07ed896722709e7; cart_ver=gcp-us-central1%3A3; _shopify_sa_t=2021-03-19T15%3A14%3A12.512Z"
//   },
//   "referrer": "https://limitededt.com/",
//   "referrerPolicy": "origin",
//   "body": "_method=patch&authenticity_token=cm7PDy0%2BTBCfrgCMIbb3MUlTgnu4X1GEGVrBfeUUdRwVwEfeCKMeJtWWLqES%2FSoZv7F%2FLRqFEw0s0Md%2Fiwxw9g%3D%3D&previous_step=payment_method&step=&s=east-aafdcd1781777496cb610b38caa90d10&checkout%5Bpayment_gateway%5D=13045235769&checkout%5Bcredit_card%5D%5Bvault%5D=false&checkout%5Bdifferent_billing_address%5D=false&checkout%5Bremember_me%5D=false&checkout%5Bremember_me%5D=0&checkout%5Bvault_phone%5D=&checkout%5Btotal_price%5D=34000&complete=1&checkout%5Bclient_details%5D%5Bbrowser_width%5D=924&checkout%5Bclient_details%5D%5Bbrowser_height%5D=969&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-480",
//   "method": "POST",
//   "mode": "cors"
// });


// fetch("https://limitededt.com/9952329785/checkouts/6b1e01c2398426030a1de7ac74ca69b9", {
//   "headers": {
//     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//     "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
//     "cache-control": "max-age=0",
//     "content-type": "application/x-www-form-urlencoded",
//     "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "upgrade-insecure-requests": "1",
//     "cookie": "checkout=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVUyTURkaE1ETmtNR1EyTWpVMU1XTXdaVEEyWmpaa056TTNZMkZpTVRBeU1BWTZCa1ZVIiwiZXhwIjoiMjAyMS0wNC0wOVQxNToxNDoxMC4wNTNaIiwicHVyIjoiY29va2llLmNoZWNrb3V0In19--148ace3967e6ada9600e20a495d19e1a01c930a9; tracked_start_checkout=6b1e01c2398426030a1de7ac74ca69b9; checkout_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVUyWWpGbE1ERmpNak01T0RReU5qQXpNR0V4WkdVM1lXTTNOR05oTmpsaU9RWTZCa1ZVIiwiZXhwIjoiMjAyMi0wMy0xOVQxNToxNDoxMC4wNTNaIiwicHVyIjoiY29va2llLmNoZWNrb3V0X3Rva2VuIn19--785b40ce4e6a28eae6342d9b46dbf06b235e1b46; secure_customer_sig=; _shopify_country=Singapore; cart_currency=SGD; _orig_referrer=; _landing_page=%2F; _y=4b7f3e1c-21da-427e-9e4b-d9ed20efaf3d; _s=f203caf7-8111-4131-a7f1-dc2d162bae32; _shopify_y=4b7f3e1c-21da-427e-9e4b-d9ed20efaf3d; _shopify_s=f203caf7-8111-4131-a7f1-dc2d162bae32; _shopify_fs=2021-03-19T15%3A13%3A37Z; _shopify_sa_p=; _ga=GA1.2.1991856376.1616166816; _gid=GA1.2.1286893022.1616166816; _gat=1; _fbp=fb.1.1616166816047.412024206; shopify_pay_redirect=pending; soundestID=20210319151336-xjIEPhIfWUHKNyTO5fY307m1Mug6PpbFR5nX6ZFhmrzterHSb; omnisendAnonymousID=12EARTeOAwiGDs-20210319151336; omnisendSessionID=AnfXtz8FGrCdFY-20210319151336; coin-currency=SGD; intercom-id-la3i4bs0=b50a0db7-2eb7-4255-b337-addc692b0f4a; intercom-session-la3i4bs0=; soundest-views=3; cart=0c8085b9ac4bf93f5c644c8762dea0cf; dynamic_checkout_shown_on_cart=1; cart_ts=1616166831; cart_sig=5aa60bb2f554ad2fd0b377cbce6043d7; _secure_session_id=23a0b328f75dd6ccd07ed896722709e7; cart_ver=gcp-us-central1%3A3; _shopify_sa_t=2021-03-19T15%3A14%3A09.398Z"
//   },
//   "referrer": "https://limitededt.com/",
//   "referrerPolicy": "origin",
//   "body": "_method=patch&authenticity_token=qpCPkR%2FbQOAjGo6Js%2FZ%2FajIr4fjLQ1lkZ6dU0PVg8eXNPgdAOkYS1mkioKSAvaJCxMkcrmmZG%2B1SLVLSm3j0Dw%3D%3D&previous_step=payment_method&step=&s=east-29b506f03e93155b94b24ac449e1b934&checkout%5Bpayment_gateway%5D=13045235769&checkout%5Bcredit_card%5D%5Bvault%5D=false&checkout%5Bdifferent_billing_address%5D=false&checkout%5Bremember_me%5D=false&checkout%5Bremember_me%5D=0&checkout%5Bvault_phone%5D=&checkout%5Btotal_price%5D=34000&complete=1&checkout%5Bclient_details%5D%5Bbrowser_width%5D=924&checkout%5Bclient_details%5D%5Bbrowser_height%5D=969&checkout%5Bclient_details%5D%5Bjavascript_enabled%5D=1&checkout%5Bclient_details%5D%5Bcolor_depth%5D=24&checkout%5Bclient_details%5D%5Bjava_enabled%5D=false&checkout%5Bclient_details%5D%5Bbrowser_tz%5D=-480",
//   "method": "POST",
//   "mode": "cors"
// });
