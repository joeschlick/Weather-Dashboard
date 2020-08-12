$(document).ready(function () {

    //Gets and diplays recent searches from local storage
  var recentSearches = [];
  recentSearches = JSON.parse(localStorage.getItem("Saved Searches"));
  if (recentSearches === undefined || recentSearches === null) {
    recentSearches = [];
  }

  displaySearchHistory();
  getWeather(recentSearches[recentSearches.length - 1]);

  function displaySearchHistory() {
    $("#search-field").val("");
    $("#saved-cities").text("");
    for (let i = 0; i < recentSearches.length; i++) {
      const element = recentSearches[i];
      btn = $("<button>", {
        id: element,
        class: "buttonSearch btn btn-dark mb-1",
        text: element,
      });
      $("#saved-cities").prepend(btn);
    }
  };

  //On click empties display fields and gets weather for the city named in each button
  $("button").on("click", function () {
    btnVal = $(this).attr("id");
    $("#weather-field").empty();
    $("#forecast-field").empty();
    getWeather(btnVal);
  });

  var runSearch = $("#run-search");

  //On click runs the getWeather function based on what's entered in the input field
  runSearch.click(function () {
    var searchField = $("#search-field").val();
    console.log(searchField);
    getWeather(searchField);
    recentSearches.push(searchField);
    localStorage.setItem("Saved Searches", JSON.stringify(recentSearches));
    displaySearchHistory();
  });

  //Function gets and displays all weather data from the Open Weather Map API
  function getWeather(cityName) {
    $.ajax({
      method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName +
        "&units=imperial&appid=53d2f99f562f36701d4bf49111eb24c6",
      dataType: "json",
    }).then(function (response) {
      console.log(response);

      //Gets date from UTI info
      var dateConv = new Date(response.list[0].dt * 1000).toLocaleDateString("en-US");
      
      //Gets icon png 
      var iconCode = response.list[0].weather[0].icon;
      var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
      console.log(iconURL);

      //Gets coordinates from forecast API and adds them to UV API 
      var uvLat = response.city.coord.lat;
      var uvLon = response.city.coord.lon;
      var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=53d2f99f562f36701d4bf49111eb24c6&lat=" + uvLat + "&lon=" + uvLon;

      //Creates, appends, and populates divs for the Current Weather field
      var weatherField = $("#weather-field");
      var cityEl = $("<h4>");
      var dateEl = $("<h5>");
      var iconImg = $("<img>").attr({
        id: "icon-png",
        src: iconURL,
        alt: "weather icon",
      });
      var tempEl = $("<div>");
      var humidityEl = $("<div>");
      var windEl = $("<div>");
      var uvIndexEl = $("<div>");
      var uvIndexInput = $("<span>");
      
      weatherField.append(cityEl);
      weatherField.append(dateEl);
      weatherField.append(iconImg);
      weatherField.append(tempEl);
      weatherField.append(humidityEl);
      weatherField.append(windEl);
      weatherField.append(uvIndexEl);

      cityEl.text(response.city.name);
      dateEl.text(dateConv);
      iconImg.text(iconImg);
      tempEl.text("Temperature: " + response.list[0].main.temp + " °F");
      humidityEl.text("Humidity: " + response.list[0].main.humidity + " %");
      windEl.text("Wind Speed: " + response.list[0].wind.speed + " MPH");
      uvIndexEl.text("UV Index: ");
      console.log(uvIndexUrl)

      //Accesses the UV API and color codes results based on value
      $.ajax({
        method: "GET",
        url: uvIndexUrl,
        dataType: "json",
      }).then(function (response1) {
        console.log(response1);
        uvIndexEl.append(uvIndexInput);
        uvIndexInput.text(response1.value);
        if (response1.value < 4) {
          uvIndexInput.attr("class", "badge badge-success");
        } else if (response1.value >= 4 && response1.value <= 7) {
          uvIndexInput.attr("class", "badge badge-warning");
        } else {
          uvIndexInput.attr("class", "badge badge-danger");
        }
      });

      //Creates the 5 day forecast
      for (let i = 0; i < response.list.length; i++) {
        if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          var col = $("<div>").addClass("col-md-2 m-2");
          var fcastCard = $("<div>").addClass("card bg-primary text-white p-2");
          var fcastBody = $("<div>").addClass("card-body p-2");
          var fcastDateEl = $("<h6>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
          var fcastIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon +".png");
          var fcastTemp = $("<p>").addClass("card-text").text("Temp: " + response.list[i].main.temp + " °F");
          var fcastHumidity = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + " %");
          col.append(fcastCard.append(fcastBody.append(fcastDateEl, fcastIcon, fcastTemp, fcastHumidity)));
          $("#forecast-field").append(col);
        }
      }
    });
  }
});
