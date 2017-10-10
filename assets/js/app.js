var recommendationsObj = {
  pairs: [{
    icon: "chancetstorms",
    beer: "smoked stout",
  }, {
    icon: "nt_chancetstorms",
    beer: "imperial stout",
  }, {
    icon: "tstorms",
    beer: "imperial IPA",
  }, {
    icon: "chancerain",
    beer: "coffee",
  }, {
    icon: "clear",
    beer: "saison",
  }, {
    icon: "mostlycloudy",
    beer: "sour",
  }, {
    icon: "partlycloudy",
    beer: "coffee stout",
  }, {
    icon: "cloudy",
    beer: "IPA",
  }, {
    icon: "rain",
    beer: "brown ale",
  }, {
    icon: "snow",
    beer: "pale ale",
  }]
}

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
    var zippy = $("<p class='zippo'>");
    var weatherInfo = $("<p>");
    console.log(results.fcttext);

    $(".weather").append(zippy);
    zippy.html(response.location.zip);
    console.log(response.location.zip + "is working");
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
    var zippy = $("<p class='zippo'>");
    var weatherInfo = $("<p>");
    var weatherIcon = response.forecast.txt_forecast.forecastday[0].icon;
    getABeer(weatherIcon);
    console.log(results.fcttext);

    $(".weather").append(zippy);
    zippy.html(response.location.zip);
    console.log(response.location.zip);
    $(".weather").append(weatherInfo);
    weatherInfo.text(results.fcttext);
    })
  }
}

weather();

function getABeer(val1) {
  var weatherKey

  for (var i = 0; i < recommendationsObj.pairs.length; i++) {
    if (recommendationsObj.pairs[i].icon === val1) {
      weatherKey = i;
    }
  }
  
  var APIkey = "c54928017d8919c3c993272329ea38d1";
  var beer = recommendationsObj.pairs[weatherKey].beer;
  console.log("line 106 I think the beer is " + beer);
  var searchQueryURL = "http://api.brewerydb.com/v2/search?key=" + APIkey + "&q=" + beer + "&type=beer&withBreweries=Y";

  var queryURL = "http://api.brewerydb.com/v2/beer/random?key=" + APIkey + "&type=beer&withBreweries=Y";

  $.ajax({
    url: searchQueryURL,
    method: "GET"
  }).done(function(cheese) {
    var randomBeerArrNum = Math.floor(Math.random() * 50);
    console.log(randomBeerArrNum);

    var description = cheese.data[randomBeerArrNum].description;
    var beerName = cheese.data[randomBeerArrNum].name;
    var abv = cheese.data[randomBeerArrNum].abv;
    var label

    if (typeof(cheese.data[randomBeerArrNum].labels) !== "undefined") {
      label = cheese.data[randomBeerArrNum].labels.large;
    }

    console.log("line 117 " + description);
    console.log(beerName);
    console.log(label);
    console.log(abv);

    sendBeerToFire(beer, description, abv);
  })
}

////////// Initializes Firebase

var config = {
    apiKey: "AIzaSyD8Ty6GU2c1yTwgvvS66r3Th5cM55HZEyA",
    authDomain: "project-one-c87a1.firebaseapp.com",
    databaseURL: "https://project-one-c87a1.firebaseio.com",
    projectId: "project-one-c87a1",
    storageBucket: "project-one-c87a1.appspot.com",
    messagingSenderId: "294964502453"
  };

firebase.initializeApp(config);

var database = firebase.database();
var beersRef = database.ref("beers");

function sendBeerToFire(beer, descript, abv) {
  var beerObj = {
    beer: beer,
    description: descript,
    abv: abv
  }

  beersRef.push(beerObj); 

  beersRef.on("child_added", function(snapshot) {
    var children = snapshot.numChildren();
    console.log("number of beers in the database: " + children);
  })
}