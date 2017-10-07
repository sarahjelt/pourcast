function weather() {
  console.log("running");
  var zip = $(this).attr("zippy");
  //this URL doesn't include the ZIP variable -- DarkSky requires latitude,longitude so we need to figure out how to convert ZIP code input to latitude,longitude then use that as variable we plug in to API URL
  var queryURL = "https://api.darksky.net/forecast/fb4108e2567beb3a132c23bfa046a5d0/35.895040,-78.923747";

  $.ajax({
    url: queryURL,
    method: 'GET'
  })
  .done(function(response) {
    var results = response.currently;

    console.log(results.summary);
    })
}

weather();