chrome.storage.local.get(null, function (details) {
    if (details.shopifyEnabled == true) {
        var profileId = details.IdSelected;
        var profileDetails = details[profileId];
        $("#number").val(profileDetails["cardNumber"]);
        $("#name").val(profileDetails["cardName"]);
        $("#expiry").val(
            profileDetails["expMonth"] + " / " + profileDetails["expYear"]
        );
        $("#verification_value").val(profileDetails["cvv"]);
    }
});

//added test comment
