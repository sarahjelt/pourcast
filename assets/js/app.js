$(".submit").on("click", function(event) {
  var zip = $(".zippy").val().trim();
  event.preventDefault();

  localStorage.clear();
  localStorage.setItem("zip", zip);

  $(".weather").empty();
  var queryURL = "https://api.wunderground.com/api/b6005ea6b47964f3/forecast/geolookup/q/" + localStorage.getItem("zip") + ".json";

  $.ajax({
    url: queryURL,
    method: 'GET'
  })
  .done(function(response) {
    var results = response.forecast.txt_forecast.forecastday[0];
    var weatherInfo = $("<p>");
    console.log(results.fcttext);

    $(".weather").append(weatherInfo);
    weatherInfo.text(localStorage.getItem("zip")); //cannot get this to print to screen...
    $(".weather").append(weatherInfo);
    weatherInfo.text(results.fcttext);
    })
});

function weather() {
  if (localStorage.getItem("zip").length === 5) {
    console.log("running");
    var zip = $(".zippy").val().trim();
    var queryURL = "https://api.wunderground.com/api/b6005ea6b47964f3/forecast/geolookup/q/" + localStorage.getItem("zip") + ".json";
    
    $.ajax({
      url: queryURL,
      method: 'GET'
    })
  .done(function(response) {
    var results = response.forecast.txt_forecast.forecastday[0];
    var weatherInfo = $("<p>");
    console.log(results.fcttext);

    $(".weather").append(weatherInfo);
    weatherInfo.text(localStorage.getItem("zip")); //cannot get this to print to screen...
    $(".weather").append(weatherInfo);
    weatherInfo.text(results.fcttext);
    })
  }
}

weather();
