chrome.storage.local.get(null,function(profile) {
    console.log(profile)
    for (var key in profile) {
        if (key.includes("profile")) {
            var profileName = profile[key]['profileName']
            console.log(profileName)
            var newProfileContent = "<tr><td id=" + key +">" + profileName + "</td></tr>"
            $("#profile-scroll tbody").append(newProfileContent)
        }
    }
})



//CLICKABLE EVENTS

$("#profile-scroll").on("click","td",function() {
    var profileNumber = $(this).attr("id")
    console.log(profileNumber)
    $(".profile-edit").find("iframe").prop("src", function(){
        return $(this).data("src") + "?id=" + profileNumber
    });
})



$("#new-profile").click(function(){
    $(".profile-edit").find("iframe").prop("src", function(){
        // Set their src attribute to the value of data-src
        return "new-profile.html"
    });
  });




