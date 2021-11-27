
// console.log("HELLO")
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       if (request.queuePassed == true) {
//           chrome.storage.local.get({adidasEnabled:"",adidasSku:"",adidasAutoATC:"",adidasAutopay:""},function(details) {
//             if (details.adidasEnabled == true && details.adidasAutoATC == true) {
//                 fetch("https://www.adidas.com.sg/api/products/"+ details.adidasSku +"/availability", {
//                     "method": "GET",
//                     "mode": "cors"
//                     }).then(response => {
//                         return response.json()
//                     }).then(data => {
//                         var variantList = data['variation_list']
//                         var availableSizes = []
//                         for (var i=0;i<variantList.length;i++) {
//                             if (variantList[i]['availability_status'] == "IN_STOCK") {
//                                 availableSizes.push(variantList[i])
//                             }
//                         }
//                         console.log(availableSizes)
//                         const randomNumber = Math.floor(Math.random() * availableSizes.length)
//                         var productSku = availableSizes[randomNumber]['sku']
//                         var productSize = availableSizes[randomNumber]['size']
//                         addToCart(details.adidasSku,productSku,productSize)
                       
//                     })
//             }
//           })
//       }
//     }
//   );

chrome.storage.local.get({adidasEnabled:"",adidasSku:"",adidasAutoATC:"",adidasAutopay:""},function(details) {
    if (details.adidasEnabled == true && details.adidasAutoATC == true) {
        fetch("https://www.adidas.com.sg/api/products/"+ details.adidasSku +"/availability", {
            "method": "GET",
            "mode": "cors"
            }).then(response => {
                if (response['status'] == 200) {
                    console.log("PASSED QUEUE")
                    return response.json()
                }      
            }).then(data => {
                var variantList = data['variation_list']
                var availableSizes = []
                for (var i=0;i<variantList.length;i++) {
                    if (variantList[i]['availability_status'] == "IN_STOCK") {
                        availableSizes.push(variantList[i])
                    }
                }
                console.log(availableSizes)
                const randomNumber = Math.floor(Math.random() * availableSizes.length)
                var productSku = availableSizes[randomNumber]['sku']
                var productSize = availableSizes[randomNumber]['size']
                addToCart(details.adidasSku,productSku,productSize)
               
            })
    }

})



async function addToCart(mainSku,sizeSku,displaySize) {
    await fetch("https://www.adidas.com.sg/api/cart_items", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "content-type": "application/json",
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "[{\"product_id\":\""+ mainSku +"\",\"quantity\":1,\"product_variation_sku\":\""+ sizeSku +"\",\"productId\":\""+ sizeSku +"\",\"size\":\""+ displaySize +"\",\"displaySize\":\""+ displaySize +"\",\"specialLaunchProduct\":false}]",
        "method": "POST",
        "mode": "cors"
        });
    window.location.href = "https://www.adidas.com.sg/on/demandware.store/Sites-adidas-SG-Site/en_SG/COShipping-Show"
}