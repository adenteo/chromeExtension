chrome.webRequest.onCompleted.addListener(
    function (request) {
        if (request.method == "POST") {
            var contentLength = request["responseHeaders"][9]["value"];
            if (parseInt(contentLength) <= 5000) {
                console.log("CAPTCHA SOLVED. SENDING MSG");
                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            { captchaSolved: true },
                            function (response) {}
                        );
                    }
                );
            }
        }
    },
    {
        urls: [
            "*://www.google.com/recaptcha/api2/userverify*",
            "https://www.recaptcha.net/recaptcha/api2/userverify*",
        ],
    },
    ["responseHeaders"]
);

chrome.webRequest.onCompleted.addListener(
    function (shipping) {
        console.log("Shipping loaded");
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    { shippingLoaded: true },
                    function (response) {}
                );
            }
        );
    },
    { urls: ["https://*/*/checkouts/*/shipping_rates?step=shipping_method"] },
    ["responseHeaders"]
);

chrome.webRequest.onCompleted.addListener(
    function (queue) {
        if (queue.statusCode == 200) {
            console.log("Queue passed");
            chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        { queuePassed: true },
                        function (response) {}
                    );
                }
            );
        } else {
            console.log("Waiting in queue...");
        }
    },
    { urls: ["https://www.adidas.com.sg/__queue/yeezy"] },
    ["responseHeaders"]
);

//NIKE BELOW

chrome.webRequest.onCompleted.addListener(
    function (card) {
        if (card.method == "GET") {
            chrome.tabs.query(
                { active: true, currentWindow: true },
                function (tabs) {
                    setTimeout(function () {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            { cardLoaded: true },
                            function (response) {
                                console.log(response);
                            }
                        );
                    }, 2000);
                }
            );
        }
    },
    { urls: ["https://gs-payments.nike.com/details?checkoutId=*"] },
    ["responseHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.method == "POST") {
            var formData = decodeURIComponent(
                String.fromCharCode.apply(
                    null,
                    new Uint8Array(details.requestBody.raw[0].bytes)
                )
            );
            chrome.storage.local.get(
                { nikeEnabled: "", formdata: [] },
                function (result) {
                    if (result.nikeEnabled != true) {
                        var formdataList = result.formdata;
                        formdataList.push(formData);
                        chrome.storage.local.set({ formdata: formdataList });
                    }
                }
            );
        }
    },
    { urls: ["*://api.nike.com/launch/entries/v2"] },
    ["requestBody"]
);

//this isn't really necessary since we are setting the token below when navigating to checkout page.
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.method == "POST") {
            var token = details.requestHeaders[3]["value"];
            chrome.storage.local.get(["nikeEnabled"], function (result) {
                if (result.nikeEnabled != true) {
                    console.log(token);
                    chrome.storage.local.set({ token: token });
                    chrome.tabs.query({ active: true }, function (tabs) {
                        chrome.tabs.remove(tabs[0].id);
                    });
                }
            });
        }
    },
    { urls: ["*://api.nike.com/launch/entries/v2"] },
    ["requestHeaders"]
);

//set token when checkout page is loaded
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        var token = details.requestHeaders[3]["value"];
        console.log(token);
        chrome.storage.local.set({ token: token });
    },
    { urls: ["*://gs-profiles.nike.com/api/v1/Profile/*/*/PaymentCard__"] },
    ["requestHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.method == "GET") {
            var token = details.requestHeaders[3]["value"];
            console.log("Bearer token:" + token);
            chrome.storage.local.set({ token: token });
        }
    },
    { urls: ["https://api.nike.com/launch/entries/v2"] },
    ["requestHeaders"]
);
