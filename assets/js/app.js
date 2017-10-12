var recommendationsObj = {
  pairs: [{
    icon: "chancetstorms",
    beer: ["gose", "hefeweizen", "wit"],
  }, {
    icon: "nt_chancetstorms",
    beer: ["dubbel"],
  }, {
    icon: "tstorms",
    beer: ["imperial IPA", "pale ale"],
  }, {
    icon: "chancerain",
    beer: ["cream stout"],
  }, {
    icon: "clear",
    beer: ["saison", "sour", "shandy"],
  }, {
    icon: "mostlycloudy",
    beer: ["pumpkin ale"],
  }, {
    icon: "partlycloudy",
    beer: ["coffee stout", "barley wine", "farmhouse ale"],
  }, {
    icon: "cloudy",
    beer: ["spiced ale"],
  }, {
    icon: "rain",
    beer: ["IPA"],
  }, {
    icon: "snow",
    beer: ["imperial stout"],
  }, {
    icon: "chanceflurries",
    beer: ["smoked stout"],
  }, {
    icon: "chancesleet",
    beer: ["baltic porter"],
  }, {
    icon: "chancesnow",
    beer: ["oatmeal stout"],
  }, {
    icon: "flurries",
    beer: ["milk stout", "oyster stout"],
  }, {
    icon: "fog",
    beer: ["amber ale", "bitter"],
  }, {
    icon: "hazy",
    beer: ["pale ale", "imperial pilsner"],
  }, {
    icon: "mostlysunny",
    beer: ["saison", "kolsch"],
  }, {
    icon: "partlysunny",
    beer: ["berliner weiss", "pale lager"],
  }, {
    icon: "sunny",
    beer: ["pale ale", "biere de garde"],
  }, {
    icon: "sleet",
    beer: ["eisbock", "dunkelweizen"],
  }, {
    icon: "unknown",
    beer: ["wine"],
  }]
}

//when you submit zip code, set that zip in localstorage and rec new beer
$(".submit").on("click", function(event) {
  var zip = $(".zippy").val().trim();
  event.preventDefault();

  localStorage.clear();
  localStorage.setItem("zip", zip);

  $(".weather").empty();
  $(".beer").empty();
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
    console.log(results.fcttext);

    $(".weather").append(zippy);
    zippy.html(response.location.zip);
    console.log(response.location.zip + "is working");
    $(".weather").append(weatherInfo);
    weatherInfo.text(results.fcttext);
    getABeer(weatherIcon);
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
    zippy.text(response.location.zip);
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

  var randomBeerType = Math.floor(Math.random() * recommendationsObj.pairs[weatherKey].beer.length)
  var APIkey = "c54928017d8919c3c993272329ea38d1";
  var beer = recommendationsObj.pairs[weatherKey].beer[randomBeerType];
  console.log("line 106 I think the beer is " + beer);
  var searchQueryURL = "https://api.brewerydb.com/v2/search?key=" + APIkey + "&q=" + beer + "&type=beer&withBreweries=Y";

  $.ajax({
    url: searchQueryURL,
    method: "GET"
  }).done(function(cheese) {
    var randomBeerArrNum = Math.floor(Math.random() * 50);
    console.log(randomBeerArrNum);
    console.log(cheese);


    var beerName = cheese.data[randomBeerArrNum].name;
    var brewery = cheese.data[randomBeerArrNum].breweries[0].name;
    var abv;
    var description;
    var label;

    if (typeof(cheese.data[randomBeerArrNum].labels) !== "undefined") {
      label = cheese.data[randomBeerArrNum].labels.large;
    }
    else {
      label = "assets/images/placehold.jpg";
    }

    if (typeof(cheese.data[randomBeerArrNum].description) !== "undefined") {
      description = cheese.data[randomBeerArrNum].description;      
    }
    else {
      description = "";
    }

    if (typeof(cheese.data[randomBeerArrNum].abv) !== "undefined") {
      abv = cheese.data[randomBeerArrNum].abv;
    }
    else {
      abv = "mystery";
    }

    var beerPrint = $("<p class='beero'>");
    var beerBrewery = $("<p class='brewery'>");
    var beerInfo = $("<p>");
    var beerLabel = $("<img>");
    $(".beer").append(beerPrint);
    beerPrint.html(beerName);
    $(".beer").append(beerBrewery);
    beerBrewery.html(brewery);
    $(".beer").append(beerInfo);
    beerInfo.html(description + "<br>" + abv + " % ABV");
    beerLabel.attr("src", label).addClass("img-responsive beer-label");
    $(".beer").append(beerLabel);

    console.log("line 117 " + description);
    console.log(beerName);
    console.log(label);
    console.log(abv);
    console.log(beerBrewery)

    sendBeerToFire(beerName, description, abv, brewery);
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

function sendBeerToFire(beer, descript, abv, brewery) {
  if (descript === "undefined") {
    descript = "";
  }

  var beerObj = {
    beer: beer,
    description: descript,
    abv: abv,
    brewery: brewery
  }

  beersRef.push(beerObj); 

  database.ref().on("child_added", function(snapshot) {
    var kiddo = snapshot.numChildren();
    console.log(kiddo);
    console.log("number of beers in the database: " + kiddo);
      console.log(snapshot.val());
    $(".odometer").text(kiddo);

    $('.table').prepend("<tr><td></td><td></td><td></td></tr>");

      var firstRowTds = $("table")
        .children()
        .eq(1)
        .children("tr")
        .eq(0)
        .children("td");

      firstRowTds.eq(0).text(snapshot.val().beer);
        console.log(snapshot.val().beer);
      firstRowTds.eq(1).text(snapshot.val().brewery);
        console.log(snapshot.val().brewery);
      firstRowTds.eq(2).text(snapshot.val().abv);
        console.log(snapshot.val().abv);
  })
}


