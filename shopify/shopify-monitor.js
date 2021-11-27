chrome.storage.local.get({keywords:'',sizes:'',delay:''},function(userData) {
  shopifyKeywords.value = userData.keywords
  shopifySizes.value = userData.sizes
  shopifyDelay.value = userData.delay
})

$("#homepage").click(function(){
  window.open("../popupMain.html","_self")
})




var taskStart = false;



// document.getElementById("shopifySettings").addEventListener("click",function() {
//     window.location.href="settings.html";
// });
document.getElementById("shopifyStart").addEventListener("click", shopifyController);




function shopifyController() {
    if (taskStart == false) {
        shopifyMonitor();
    } else {
        window.open("shopify-monitor.html","_self");
    }
}



function shopifyMonitor(){
    

//   document.getElementById("shopifyStart").disabled = true;
  var keywords = shopifyKeywords.value;
  var sizes = shopifySizes.value;
  var delay = shopifyDelay.value;
  chrome.storage.local.set({'keywords':keywords,'sizes':sizes,'delay':delay})
  if (shopifyKeywords.value == "") {
    document.getElementById("shopifyKeywords").style.border = "2px solid red"
    document.getElementById("shopifyStart").style.cursor = "not-allowed"
    return
  }
  if (shopifyDelay.value == "") {
    document.getElementById("shopifyDelay").style.border = "2px solid red"
    document.getElementById("shopifyStart").style.cursor = "not-allowed"
    return
  }
  document.getElementById("shopifyKeywords").style.border = "2px solid #3a373a"
  document.getElementById("shopifyStart").style.cursor = "pointer"
  document.getElementById("shopifyDelay").style.border = "2px solid #3a373a"
  document.getElementById("shopifyStart").style.cursor = "pointer"
  taskStart = true
  var keywordsArray = keywords.split(",")
  var sizeArray = sizes.split(",")
  console.log("Size array:" + sizeArray)
  console.log(keywordsArray)
  var negativeKeywordsArray = []
  var positiveKeywordsArray = []
  for (var k = 0; k < keywordsArray.length; k++) {
    if (keywordsArray[k][0] == "-") {
        negativeKeywordsArray.push(keywordsArray[k].substring(1).toLowerCase())
    } else {
        positiveKeywordsArray.push(keywordsArray[k].toLowerCase())
    }
  }
  console.log(negativeKeywordsArray)
  console.log(positiveKeywordsArray)

  document.getElementById("shopifyStart").innerHTML = "Monitoring..."
  scrapeProducts();
  setInterval(scrapeProducts,delay)
  function scrapeProducts() {
    document.getElementById("shopifyStart").innerHTML = "Monitoring..."
    chrome.tabs.query({active:true,currentWindow:true},function(tab){
      //Be aware that `tab` is an array of Tabs 
      var url = tab[0].url
      var urlObj = new URL(url)
      var homeUrl = urlObj.origin
      const parser = new DOMParser();
      fetch(homeUrl + "/collections/all.atom").then(response => {
        return response.text();
      }).then(responseData => {
        const shopifyData = parser.parseFromString(responseData,"text/xml")
        console.log(shopifyData)
        const productData = shopifyData.getElementsByTagName('entry')
        console.log(productData)
        for (var i = 0; i < productData.length; i++) {
          var productVendor = productData[i].children[6].innerHTML
          var productTitle = productData[i].children[4].innerHTML
          var productLink =  productData[i].children[3].attributes[2].nodeValue
          console.log(productLink)
          var productTitleLower = productVendor.toLowerCase() + " " + productTitle.toLowerCase() 
          var negativeKeywordPresent = false
          for (var m=0; m < negativeKeywordsArray.length; m++) {
              if (productTitleLower.includes(negativeKeywordsArray[m])) {
                  negativeKeywordPresent = true;
              }
          }
          if (positiveKeywordsArray.every(keyword => productTitleLower.includes(keyword)) && negativeKeywordPresent == false) {
            //check if all keywords present in product title
            document.getElementById("shopifyStart").innerHTML = "Product found!"
            console.log("Found this product:" + productTitle)

            chrome.storage.local.get({autoATC:""},function(atc) {
              if (atc.autoATC == true) {
                selectSize(productLink,sizeArray,homeUrl);
                return;
              } else if (atc.autoATC == false) {
                document.getElementById("shopifyStart").innerHTML = "Going to product page..."
                console.log(productLink)
                chrome.tabs.query({active:true,currentWindow:true},function(tab){
                  chrome.tabs.update(tab.id, {url: productLink});
              })
                window.open("shopify-discount.html","_self")
                return;
              }
            })
            break;
        
          
          }
        }
      })
    });
 
  }
}

//CHECKING IF SIZE IS AVAILABLE

function selectSize(productLink,sizeArray,homeUrl) {
  fetch(productLink + ".json").then(response => {
    return response.json();
  }).then(responseData => {
    var productAdded = false;
    var productVariantData = responseData.product.variants
    var individualVariantData = {}
    for (var j=0;j<productVariantData.length;j++) {
      individualVariantData[productVariantData[j].title] = productVariantData[j].id 
    }
    if (sizeArray != "") {
      for (var k=0;k<sizeArray.length;k++) {
      if (sizeArray[k] in individualVariantData) {
        document.getElementById("shopifyStart").innerHTML = "Adding to cart!"
        console.log(individualVariantData[sizeArray[k]])
        addToCart(individualVariantData[sizeArray[k]],homeUrl)
        return
      }
    }
    } else {
      document.getElementById("shopifyStart").innerHTML = "Adding random size to cart..."
      var randomProperty = function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
    };
      addToCart(randomProperty(individualVariantData),homeUrl)
      return
    }
   
    document.getElementById("shopifyStart").innerHTML = "Sizes not found!"
  })
}






// function selectSize(productLink,sizeArray,homeUrl) {
//     fetch(productLink + ".json").then(response => {
//         return response.json();
//       }).then(responseData => {
//         var productAdded = false;
//         var productVariants = responseData.product.variants
//         for (var j = 0; j < productVariants.length; j++) {
//           var sizeVariant = productVariants[j].id
//           var sizeDisplay = productVariants[j].title
//           console.log(sizeDisplay)
//           if (sizeArray.includes(sizeDisplay)) {
//             var productAdded = true;
//             addToCart(sizeVariant,homeUrl);
//             break;
//           }
// }
// if (!productAdded) {
//     document.getElementById("shopifyStart").innerHTML = "Size not found!"
// }
// })}

//ADDING PRODUCT TO CART


async function addToCart(sizeVariant,homeUrl) {
  console.log(sizeVariant)
    await fetch(homeUrl + "/cart/add.js?quantity=1&id=" + sizeVariant)
    document.getElementById("shopifyStart").innerHTML = "Added to cart!"
    chrome.tabs.query({active:true,currentWindow:true},function(tab){
        chrome.tabs.update(tab.id, {url: homeUrl + "/checkout"});
    })
    productAdded = true;
    window.open("shopify-discount.html","_self")
}




















// fetch(productLink + ".json").then(response => {
//     return response.json();
//   }).then(responseData => {
//     var productVariants = responseData.product.variants
//     var productAdded = false;
//     for (var j = 0; j < productVariants.length; j++) {
//       var sizeVariant = productVariants[j].id
//       var sizeDisplay = productVariants[j].title
//       console.log(sizeDisplay)
//       if (sizeArray.includes(sizeDisplay)) {
//         //check if size is in user's preferred size range
//         document.getElementById("shopifyStart").innerHTML = "Adding to cart..."
//         console.log("Size found!")
//         fetch("https://limitededt.com/cart/add.js?quantity=1&id=" + sizeVariant)
//         document.getElementById("shopifyStart").innerHTML = "Added to cart!"
//         chrome.tabs.update(tab.id, {url: "https://limitededt.com/checkout"});
//         productAdded = true;
//         setTimeout(() => window.close(),500)
//       }
//     }
//     console.log(productAdded)

//   })