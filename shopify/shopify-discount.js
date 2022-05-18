$("#shopifyApply").click(function() {
    var discountCode = document.getElementById("shopifyCode").value
    chrome.storage.local.set({'code':discountCode})
    $(this).html("Code applied!")
})

//test comment 12345
