
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.cardLoaded == true)
//             $(".new-card-link").click()
//             setTimeout(function(){
//                 chrome.storage.local.get(['nikeEnabled'],function(details){
//                     if (details.nikeEnabled == true) {
                        // document.querySelector("#checkout > esw-payment-details > div > div.category-header > div:nth-child(2) > div > esw-expand-collapse-icon > div").click()
                        // $(".button-submit").remove()
                        // $(".disclaimer").append("<div><h1 style=color:green;>" + "ENTRY WILL BE SUBMITTED VIA REQUEST." +"</h1></div")
//                     } else {
//                         document.querySelector("#checkout > div.buttonContainer > button").innerHTML = "GENERATE TOKEN"
//                     }
                   
//                 }) 
//             },0)
   
      
//     }
//   );

setInterval(function addCard(){
    if (document.querySelector(".new-card-link") != null) {
        document.querySelector(".new-card-link").click()
        chrome.storage.local.get(['nikeEnabled'],function(details) {
            if (details.nikeEnabled == false) {
                document.querySelector("#checkout > div.buttonContainer > button").innerHTML = "GENERATE TOKEN"
            } else if (details.nikeEnabled == true) {
                document.querySelector("#checkout > esw-payment-details > div > div.category-header > div:nth-child(2) > div > esw-expand-collapse-icon > div").click()
                $(".disclaimer").html("<div><h1 style=color:red;>" + "NO TOKENS DETECTED FOR THIS DROP" +"</h1></div")
            }
            clearInterval(addCard)
        })

    }
},500)


  

  
chrome.storage.local.get(['nikeHour','nikeMinute','nikeSecond','nikeMillisecond','nikeEnabled','token','formdata','webhook'], function(result) {
    console.log(result.formdata)
    if (result.formdata == undefined) {
        return
    }
    var currentUrl = window.location.href
    function getReturnUrl(str) {
        return str.split('returnUrl=')[1];
    }


    var returnUrl = decodeURIComponent(getReturnUrl(currentUrl))
    var submitOrder = setInterval(function() {
        if(new Date().getHours() > result.nikeHour || new Date().getHours() >= result.nikeHour && new Date().getMinutes() > result.nikeMinute || new Date().getHours() >= result.nikeHour && new Date().getMinutes() >= result.nikeMinute && new Date().getSeconds() >= result.nikeSecond && new Date().getMilliseconds() >= result.nikeMillisecond){
            clearInterval(submitOrder)
            console.log("SUBMITTING ORDERS...")
            var retryCount = 0
            function orderData() {
                chrome.storage.local.get({'token':""},function(details) {
                var fetchList = []
                for (var i=0;i< (result.formdata).length;i++) {
                    var entryData = result.formdata[i]
                    var entryIndex = i
                    var entryDataJson = JSON.parse(result.formdata[i])
                    var entryEmail = entryDataJson['shipping']['recipient']['email']             
                            console.log("FETCHING AT THIS TIMING")
                            console.log(new Date().getMilliseconds())
                            fetchList.push(
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
                                })
                            )
                            
                            

                }
                Promise.all(fetchList).then(function (responses) {
                    return Promise.all(responses.map(function (response) {
                        if (response.status == 409) {
                            return response.json();
                        }
                    }));
                }).then(function (data) {
                        // Log the data to the console
                        // You would do something with both sets of data here
                        for (var j=0;j<data.length;j++) {
                            var entryResponse = data[j]
                            if (entryResponse != undefined) {
                                    console.log(entryResponse)
                                    var obj = {}
                                    // obj[entryResponse['launchId']] = {'productTitle':productTitle,'productSubtitle':productSubtitle,'productSize':productSize,'productImg':productImg}
                                    // chrome.storage.local.set(obj)
                                    function hexToDecimal(hex) {
                                        return parseInt(hex.replace("#",""), 16)
                                    }
                                    function discordWebhook() {
                                            var request = new XMLHttpRequest();
                                            request.open("POST", result.webhook);
                                            request.setRequestHeader('Content-type', 'application/json');
                                        
                                            var myEmbed = {
                                            footer: {
                                                text:"AdenAIO V1.0.5",
                                                icon_url:"https://i.imgur.com/VjQYSHz.png"
                                            },
                                            author: {
                                            name: "Nike SNKRS"
                                            },
                                            title: "Draw entered",
                                         
                                            description: "You have successfully entered the draw. Goodluck!",
                                            fields: [{
                                                name: 'Product Name',
                                                value: "test3"
                                            },
                                     
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
                                    // var productResultApi = data['links']['self']['ref']
                                    // chrome.storage.local.get({'productResultApiList':[]},function(result){
                                    //     var resultApiList = result.productResultApiList
                                    //     resultApiList.push(productResultApi)
                                    //     chrome.storage.local.set({'productResultApiList':resultApiList})
                                    // })                                    
                                    // function hexToDecimal(hex) {
                                    //     return parseInt(hex.replace("#",""), 16)
                                    // }
                                    // function discordWebhook() {
                                    //         var request = new XMLHttpRequest();
                                    //         request.open("POST", result.webhook);
                                    //         request.setRequestHeader('Content-type', 'application/json');
                                        
                                    //         var myEmbed = {
                                    //         footer: {
                                    //             text:"AdenAIO V1.0.5",
                                    //             icon_url:"https://i.imgur.com/VjQYSHz.png"
                                    //         },
                                    //         author: {
                                    //         name: "Nike SNKRS"
                                    //         },
                                    //         title: "Draw entered",
                                    //         thumbnail: {
                                    //             url: productImg
                                    //         },
                                    //         description: "You have successfully entered the draw. Goodluck!",
                                    //         fields: [{
                                    //             name: 'Product Name',
                                    //             value: productSubtitle + " - " + productTitle
                                    //         },
                                    //         {
                                    //             name: 'Size',
                                    //             value: productSize
                                    //         },
                                    //         {
                                    //             name:'Entry time',
                                    //             value: data['creationDate']
                                    //         },
                                    //         {
                                    //             name: 'Email',
                                    //             value: entryEmail
                                    //         }
                                    //         ],
                                    //             color: hexToDecimal("#32cd32")
                                    //         }
                                        
                                    //         var params = {
                                    //         username: "AdenAIO",
                                    //         embeds: [ myEmbed ]
                                    //     }
                                        
                                    //         request.send(JSON.stringify(params));
                                    //     }
                            
                                    //     discordWebhook();
                                        
                                    //     setTimeout(function() {
                                    //         window.location.href = returnUrl
                                    //     },2000)
                            }
                        }
                    }).catch(function (error) {
                        // if there's an error, log it
                        console.log(error);
                    });
                console.log(fetchList)
            })
            }
            orderData();
        }     
    },100)
 
  
    
   
 
});