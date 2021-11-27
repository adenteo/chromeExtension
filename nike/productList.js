var launchesAPI = "https://api.nike.com/product_feed/threads/v2/?anchor=0&count=36&filter=marketplace%28SG%29&filter=language%28en-GB%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc&fields=active%2Cid%2ClastFetchTime%2CproductInfo%2CpublishedContent.nodes%2CpublishedContent.subType%2CpublishedContent.properties.coverCard%2CpublishedContent.properties.productCard%2CpublishedContent.properties.products%2CpublishedContent.properties.publish.collections%2CpublishedContent.properties.relatedThreads%2CpublishedContent.properties.seo%2CpublishedContent.properties.threadType%2CpublishedContent.properties.custom%2CpublishedContent.properties.title"
fetch("https://api.nike.com/product_feed/threads/v2/?anchor=0&count=36&filter=marketplace%28SG%29&filter=language%28en-GB%29&filter=upcoming%28true%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29&sort=effectiveStartSellDateAsc&fields=active%2Cid%2ClastFetchTime%2CproductInfo%2CpublishedContent.nodes%2CpublishedContent.subType%2CpublishedContent.properties.coverCard%2CpublishedContent.properties.productCard%2CpublishedContent.properties.products%2CpublishedContent.properties.publish.collections%2CpublishedContent.properties.relatedThreads%2CpublishedContent.properties.seo%2CpublishedContent.properties.threadType%2CpublishedContent.properties.custom%2CpublishedContent.properties.title", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "appid": "com.nike.commerce.snkrs.web",
    "content-type": "application/json; charset=UTF-8",
    "nike-api-caller-id": "nike:snkrs:web:1.0",
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
  "mode": "cors"
}).then(response => {return response.json()}).then(data => {
    var productList = data['objects']
    console.log(productList)
    for (var i=0;i<productList.length;i++) {
        var subProducts = productList[i]['productInfo']
        for (var j=0;j<subProducts.length;j++) {
            if (subProducts[j]['launchView'] != undefined) {
                var launchDate = subProducts[j]['launchView']["startEntryDate"]
                var launchType = subProducts[j]['launchView']["method"]
                var imageUrl = subProducts[j]['imageUrls']['productImageUrl']
                var productTitle = subProducts[j]['productContent']['fullTitle']
                var productSubtitle = subProducts[j]['productContent']['colorDescription']
                var productLaunchid = subProducts[j]['launchView']['productId']
                var productSlug = productList[i]['publishedContent']['properties']['seo']['slug']
                var productPrice = subProducts[j]['merchPrice']['fullPrice']
                var productSizes = subProducts[j]['skus']
                var productSku = subProducts[j]['merchProduct']['styleColor']
                $("#productList").append("<div class='individualProduct'><h3>" + productTitle + "<br>" + productSubtitle + "<br>S$" + productPrice +"<br>" + productSku+ "<br>" +  launchType +  "<br>" + launchDate + "</h3><img src=" + imageUrl +"><img><div><label>Choose a size: </label><select id='"+ productSlug +"' class='sizeList "+ productLaunchid +"'></select><input class='generate' id='"+ productLaunchid +"' type='button' value='Generate'></div></div>")
                for (var k=0;k<productSizes.length;k++) {
                    $(".sizeList." + productLaunchid).append("<option value="+ productSizes[k]["nikeSize"] +">"+ productSizes[k]["nikeSize"] +"</option>")
                }
            }
           
         
        }
    }
    $(".generate").click(function(){
        var className = $(this).attr('id');
        var sizeSelected = $(".sizeList." + className).val()
        var slug = $(".sizeList." + className).attr('id');
        window.open("https://www.nike.com/sg/launch/t/" + slug + "?size=" + sizeSelected + "&productId=" + className,"_blank")
    })
})



