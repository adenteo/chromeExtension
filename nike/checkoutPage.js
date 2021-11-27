var setPage = setInterval(function(){
    if (document.querySelector("#checkout > div.buttonContainer > button") != null) {
        if (document.querySelector(".new-card-link") != null) {
            document.querySelector(".new-card-link").click()
        }
        chrome.storage.local.get(['nikeEnabled'],function(details) {
                console.log(details.nikeEnabled)
                if (details.nikeEnabled == false) {
                    document.querySelector("#checkout > div.buttonContainer > button").innerHTML = "GENERATE TOKEN"
                } else if (details.nikeEnabled == true) {
                    document.querySelector("#checkout > esw-payment-details > div > div.category-header > div:nth-child(2) > div > esw-expand-collapse-icon > div").click()
                    $(".disclaimer").html("<div><h1 style=color:red;>" + "NO TOKENS DETECTED FOR THIS DROP" +"</h1></div")
                }
                clearInterval(setPage)
            })    
    }
  
    
},500)

chrome.storage.local.get(null,function(details){
    console.log(details)
})


chrome.storage.local.get(['nikeHour','nikeMinute','nikeSecond','nikeMillisecond','nikeEnabled','token','formdata','webhook'], function(result) {
    if (result.nikeEnabled == false) {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
              if (request.cardLoaded == true) {
                $(".button-submit").click()
              
              }
               
            }
          );
    }
    console.log(result.formdata)
    if (result.formdata == undefined) {
        return
    }
    var currentUrl = window.location.href
    function getReturnUrl(str) {
        return str.split('returnUrl=')[1];
    }


    var returnUrl = decodeURIComponent(getReturnUrl(currentUrl))
    for (var i=0;i< (result.formdata).length;i++) {
        var entryData = result.formdata[i]
        var entryIndex = i
        var entryDataJson = JSON.parse(result.formdata[i])
        var entryEmail = entryDataJson['shipping']['recipient']['email']
        if (currentUrl.includes(entryDataJson['launchId']) && result.nikeEnabled == true) {
            console.log("Submitting entry for launch: " + entryDataJson['launchId'] + "\nPrice: S$" + entryDataJson['priceChecksum'])
            var retryCount = 0
            var submitOrder = setInterval(function(){
                var submitTime = "<h1 style=color:black;font-size:20px;>" +  result.nikeHour + " : "+ result.nikeMinute + " : "+ result.nikeSecond + " : " + result.nikeMillisecond + "</h1>"
                $(".disclaimer").html("<div><h1 style=color:green;>" + "HARVESTED TOKEN DETECTED FOR THIS DROP.<br><br>ENTRY WILL BE SUBMITTED VIA REQUEST AT:<br><br>"+ submitTime +"</h1></div")
            if(new Date().getHours() > result.nikeHour || new Date().getHours() >= result.nikeHour && new Date().getMinutes() > result.nikeMinute || new Date().getHours() >= result.nikeHour && new Date().getMinutes() >= result.nikeMinute && new Date().getSeconds() >= result.nikeSecond && new Date().getMilliseconds() >= result.nikeMillisecond){
                clearInterval(submitOrder)
                function trySubmit() {
                        console.log("Submitting...")
                        chrome.storage.local.get({'token':""},function(details) {
                            console.log(entryData)
                            $(".disclaimer").html("<div><h1>Submitting entry...</h1></div>")
                            fetch("https://api.nike.com/launch/entries/v2", {
                                "headers": {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                                "appid": "com.nike.commerce.snkrs.web",
                                "authorization": details.token,
                                "content-type": "application/json",
                                "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-site"
                                },
                                "credentials":"include",
                                "referrerPolicy": "no-referrer-when-downgrade",
                                "body": entryData,
                                "method": "POST",
                                "mode": "cors"
                            }).then(response => {
                                if (response.status == 201) {
                                    $(".disclaimer").html("<div><h1>Entry has been submitted successfully!</h1></div>")
                                    return response.json()
                                } else if (response.status == 409) {
                                    $(".disclaimer").html("<div><h1>Submitted too early!</h1></div>")
                                    console.log("SUBMITTED TOO EARLY")
                                    retryCount += 1
                                    console.log(retryCount)
                                    if (retryCount >= 5) {
                                        return "Error"
                                    }
                                    setTimeout(trySubmit,50)
                                } else {
                                    return "Error"
                                }
                            }).then(data => {
                                if (data == "Error") {
                                    var productSubtitle = $(".subtitle").html()
                                    var productTitle = $(".product-title").html()
                                    var productSize = $(".size").html()
                                    var productImg = document.querySelector("#checkout > esw-product-details > div > div.product-image > img").src
                                    function hexToDecimal(hex) {
                                        return parseInt(hex.replace("#",""), 16)
                                    }
                                    function discordWebhook() {
                                            var request = new XMLHttpRequest();
                                            request.open("POST", result.webhook);
                                            request.setRequestHeader('Content-type', 'application/json');
                                        
                                            var myEmbed = {
                                            footer: {
                                                text:"AdenAIO V1.0.7",
                                                icon_url:"https://i.imgur.com/VjQYSHz.png"
                                            },
                                            author: {
                                            name: "Nike SNKRS"
                                            },
                                            title: "Error occurred",
                                            thumbnail: {
                                                url: productImg
                                            },
                                            description: "Failed to enter draw.",
                                            fields: [{
                                                name: 'Product Name',
                                                value: productSubtitle + " - " + productTitle
                                            },
                                            {
                                                name: 'Size',
                                                value: productSize
                                            },
                                            {
                                                name:'Retry Count',
                                                value: retryCount
                                            },
                                            {
                                                name: 'Email',
                                                value: entryEmail
                                            }
                                            ],
                                                color: hexToDecimal("#FF0000")
                                            }
                                        
                                            var params = {
                                            username: "AdenAIO",
                                            embeds: [ myEmbed ]
                                        }
                                        
                                            request.send(JSON.stringify(params));
                                        }
                                        discordWebhook();
                                } else {
                                    var productSubtitle = $(".subtitle").html()
                                    var productTitle = $(".product-title").html()
                                    var productSize = $(".size").html()
                                    var productImg = document.querySelector("#checkout > esw-product-details > div > div.product-image > img").src
                                    var obj = {}
                                    obj[entryDataJson['launchId']] = {'productTitle':productTitle,'productSubtitle':productSubtitle,'productSize':productSize,'productImg':productImg,'entryEmail':entryEmail}
                                    chrome.storage.local.set(obj)
                                    var productResultApi = data['links']['self']['ref']
                                    chrome.storage.local.get({'productResultApiList':[]},function(result){
                                        var resultApiList = result.productResultApiList
                                        resultApiList.push(productResultApi)
                                        chrome.storage.local.set({'productResultApiList':resultApiList})
                                    })                                    
                                    function hexToDecimal(hex) {
                                        return parseInt(hex.replace("#",""), 16)
                                    }
                                    function discordWebhook() {
                                            var request = new XMLHttpRequest();
                                            request.open("POST", result.webhook);
                                            request.setRequestHeader('Content-type', 'application/json');
                                        
                                            var myEmbed = {
                                            footer: {
                                                text:"AdenAIO V1.0.7",
                                                icon_url:"https://i.imgur.com/VjQYSHz.png"
                                            },
                                            author: {
                                            name: "Nike SNKRS"
                                            },
                                            title: "Draw entered",
                                            thumbnail: {
                                                url: productImg
                                            },
                                            description: "You have successfully entered the draw. Goodluck!",
                                            fields: [{
                                                name: 'Product Name',
                                                value: productSubtitle + " - " + productTitle
                                            },
                                            {
                                                name: 'Size',
                                                value: productSize
                                            },
                                            {
                                                name:'Entry time',
                                                value: data['creationDate']
                                            },
                                            {
                                                name:'Retry Count',
                                                value: retryCount
                                            },
                                            {
                                                name: 'Email',
                                                value: entryEmail
                                            }
                                            ],
                                                color: hexToDecimal("#32cd32")
                                            }
                                        
                                            var params = {
                                            username: "AdenAIO",
                                            embeds: [ myEmbed ]
                                        }
                                        
                                            request.send(JSON.stringify(params));
                                        }
                            
                                        discordWebhook();
                                        //REDIRECTS TO PRODUCT PAGE AFTER
                                        // setTimeout(function() {
                                        //     window.location.href = returnUrl
                                        // },2000)
                                        
                                }
                            
                            }).catch(error => {
                                console.log(error)
                                return
                            });    
                            
                        })
                     
                                }
                                trySubmit()
                    
                        }
                    
                        }, 100);
                     break
        }
    }
    
   
 
});