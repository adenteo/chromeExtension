var date = new Date();
var resultDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),00,02,30)
var result2Date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),10,32,30)
var difference = resultDate.getTime() - date.getTime()
var difference2 = result2Date.getTime() - date.getTime()



setTimeout(checkResult,difference)
function checkResult() {
    console.log("CHECKING RESULTS!")
    chrome.storage.local.get(['token','webhook','productResultApiList'],function(details) {
            var resultList = details.productResultApiList
            console.log(resultList)
            if (resultList.length != 0) {
                var resultFetch = []
                for (var i=0;i<details.productResultApiList.length;i++){
                    var resultApi = resultList[i]
                    console.log(resultApi)
                    var resultIndex = i
                    console.log("Getting result for " + resultList[i])
                    resultFetch.push(
                        fetch("https://api.nike.com" + resultApi, {
                        "headers": {
                            "accept": "application/json",
                            "accept-language": "en-US,en;q=0.9",
                            "appid": "com.nike.commerce.snkrs.web",
                            "authorization": details.token,
                            "content-type": "application/json; charset=UTF-8",
                            "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site",
                        },
                        "referrer": "https://www.nike.com/",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": null,
                        "method": "GET",
                        "mode": "cors",
                        "credentials": "include"
                        })
                    ) 
                }
                Promise.all(resultFetch).then(responses => {
                    return Promise.all(responses.map(function (response) {
                            return response.json();
                        }))
                }).then(response => {
                    var resultInfo = response.map(
                        function(data) {
                            console.log(data)
                            console.log(data['result']['status'])
                            var launchId = data['launchId']
                            console.log(launchId)
                            chrome.storage.local.get([launchId],function(details2){
                                console.log(details2)
                                var launchDetails = details2[launchId]
                                console.log(launchDetails)
                                if (data['result']['status'] == "NON_WINNER" && launchDetails != undefined) {
                                    var reasonLost = data['result']['reason'] 
                                    console.log("YOU LOST")
                                    discordWebhookLose(details.webhook,launchDetails,reasonLost)
                                    resultList.splice(resultIndex,1)
                                    chrome.storage.local.set({'productResultApiList':resultList})
                                    chrome.storage.local.remove([launchId])
                                
                                } else if (data['result']['status'] == "WINNER" && launchDetails != undefined) {
                                    discordWebhookWin(details.webhook,launchDetails)
                                    resultList.splice(resultIndex,1)
                                    chrome.storage.local.set({'productResultApiList':resultList})
                                    chrome.storage.local.remove([launchId])
                               
                                } 
                            })
                        }
                    )

                }).catch(error => {
                    console.log(error)
                    console.log("Results not out yet...")
                    setTimeout(checkResult,10000)
                })
            
            }
            
        
    
    })
}




function hexToDecimal(hex) {
    return parseInt(hex.replace("#",""), 16)
}

function discordWebhookLose(webhook,launchDetails,reasonLost) {
    var request = new XMLHttpRequest();
    request.open("POST", webhook);
    request.setRequestHeader('Content-type', 'application/json');
        var myEmbed = {
            footer: {
                text:"AdenAIO V1.0.7",
                icon_url:"https://i.imgur.com/VjQYSHz.png"
            },
            author: {
            name: "Nike SNKRS"
            },
            title: "Draw results",
            thumbnail: {
                url: launchDetails['productImg']
            },
            description: "Sorry! You did not win the draw!",
            fields: [{
                name: 'Product Name',
                value: launchDetails['productSubtitle'] + " - " + launchDetails['productTitle']
            },
            {
                name: 'Size',
                value: launchDetails['productSize']
            },
            {
                name: 'Reason',
                value: reasonLost
            },
            {
                name: 'Email',
                value: launchDetails['entryEmail']
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

function discordWebhookWin(webhook,launchDetails) {
        var request = new XMLHttpRequest();
        request.open("POST", webhook);
        request.setRequestHeader('Content-type', 'application/json');
            var myEmbed = {
                footer: {
                    text:"AdenAIO V1.0.7",
                    icon_url:"https://i.imgur.com/VjQYSHz.png"
                },
                author: {
                name: "Nike SNKRS"
                },
                title: "Draw results",
                thumbnail: {
                    url: launchDetails['productImg']
                },
                description: "Congratulations! You won the draw!",
                fields: [{
                    name: 'Product Name',
                    value: launchDetails['productSubtitle'] + " - " + launchDetails['productTitle']
                },
                {
                    name: 'Size',
                    value: launchDetails['productSize']
                },
                {
                    name: 'Email',
                    value: launchDetails['entryEmail']
                }
                ],
                    color: hexToDecimal("#FF00FF")
                }
                var params = {
                    username: "AdenAIO",
                    embeds: [ myEmbed ]
                }
                request.send(JSON.stringify(params));
    
    }
    



