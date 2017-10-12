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
    var highTemp = response.forecast.simpleforecast.forecastday[0].high.fahrenheit;
    console.log(results.fcttext);

    $(".weather").append(zippy);
    zippy.html(response.location.zip);
    console.log(response.location.zip + "is working");
    $(".weather").append(weatherInfo);
    weatherInfo.text(results.fcttext);

    if (weatherIcon === "tstorms" || weatherIcon === "rain") {
      getARainText();
    }

    else {
      getAColorText(highTemp);
    }
    
    getABeer(weatherIcon);

    })
});

function weather() {
  if (localStorage.getItem("zip").length === 5) {
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
    var highTemp = response.forecast.simpleforecast.forecastday[0].high.fahrenheit;

    $(".weather").append(zippy);
    zippy.text(response.location.zip);
    $(".weather").append(weatherInfo);
    weatherInfo.text(results.fcttext);

    getABeer(weatherIcon);

    if (weatherIcon === "tstorms" || weatherIcon === "rain") {
      getARainText();
    }

    else {
      getAColorText(highTemp);
    }
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
  var searchQueryURL = "https://api.brewerydb.com/v2/search?key=" + APIkey + "&q=" + beer + "&type=beer&withBreweries=Y";

  $.ajax({
    url: searchQueryURL,
    method: "GET"
  }).done(function(cheese) {
    var randomBeerArrNum = Math.floor(Math.random() * 50);
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

    sendBeerToFire(beerName, description, abv, brewery);
  })
}

function getARainText() {
  var colorTextArr = ["Rainboots go with everything today.", "Today's weather is wet feet. All day.",
  "Today all of your internal crying affected the universe and your own weak human tears are raining down on you. You need a beer.",
  "You’re going to look like a drowned rat. Have a beer.",
  "Do you like the smell of rain? If not, you're not going to like the smell of today."]
  var random = Math.floor(Math.random() * colorTextArr.length);
  var weatherText = colorTextArr[random];

  console.log(weatherText);
  var pColorText = $("<p>");
  pColorText.text(weatherText).appendTo(".weather");
}

function getAColorText(temp) {
  var weatherText 

  if (temp >= 90) {
    var colorTextArr = ["Today's weather is sweaty armpits and misery", 
    "Be prepared to melt like the wicked witch you know you secretly are.", 
    "Today’s weather is fried eggs on the sidewalk. They’re eco-friendly, I guess.",
    "The human body is made of 65% water and that’s way less than the humidity today. Good luck.",
    "Today’s weather is just fucking miserable.",
    "Wow, this is perfect weather for a beer. Like yesterday. And tomorrow. And forever. Every day is perfect for a beer.",
    "Today’s weather is like you smoked a bunch of bath salts in Florida but you don’t know where you got the bath salts or how you got to Florida.",
    "Mordor",
    "These are the days sweat stains are made out of.",
    "Today you’re going to sweat in places you didn’t know could sweat. It’s going to be awful."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  } 

  else if (temp >= 80 && temp < 90) {
    var colorTextArr = ["Today is undercooked fried eggs on the sidewalk. You’re still going to sweat.",
    "Today is...still too hot."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp >= 70 && temp < 80) {
    var colorTextArr = ["Is it Spring? Is it Fall? Is it that weird winter day that reminds you global warming is real? I don’t know, but head outside anyway and report back."];  
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp >= 60 && temp < 70) {
    var colorTextArr = ["Do you need a jacket? Do you wear a sweater? A t-shirt? Who the fuck knows."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp >= 50 && temp < 60) {
    var colorTextArr = ["Today’s weather is amazing so get your butt outside already.",
    "It’s rainbows and unicorns and fairies out there."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp >= 40 && temp < 50) {
    var colorTextArr = ["Wow, this is perfect weather for a beer. Jk, it’s always perfect weather for a beer."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp >= 30 && temp < 40) {
    var colorTextArr = ["Wow, this is perfect weather for a beer. Jk, it’s always perfect weather for a beer."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp >= 20 && temp < 30) {
    var colorTextArr = ["It’s too cold to leave bed. Don’t bother.",
    "Today’s weather means your hands are colder than the beer you’re drinking. Worth it."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  else if (temp < 20) {
    var colorTextArr = ["It’s Summer! ...somewhere else. Far away. Not here.",
    "Today’s weather is colder than the cold, icy heart you pretend you don’t have.",
    "Today is the cold, bleak grip of a death eater. All day."];
    var random = Math.floor(Math.random() * colorTextArr.length)
    var weatherText = colorTextArr[random];
  }

  console.log(weatherText);
  var pColorText = $("<p>");
  pColorText.text(weatherText).appendTo(".weather");
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
    console.log(snapshot.child("beers").key);
    $(".odometer").text(kiddo);
  });

  database.ref("beers").limitToLast(20).on("child_added", function(childSnapshot) {

    $('.table').prepend("<tr><td></td><td></td><td></td></tr>");

      var firstRowTds = $("table")
        .children()
        .eq(1)
        .children("tr")
        .eq(0)
        .children("td");

      firstRowTds.eq(0).text(childSnapshot.val().beer);
        console.log(childSnapshot.val().beer);
      firstRowTds.eq(1).text(childSnapshot.val().brewery);
        console.log(childSnapshot.val().brewery);
      firstRowTds.eq(2).text(childSnapshot.val().abv);
        console.log(childSnapshot.val().abv);
    // })
  })
}