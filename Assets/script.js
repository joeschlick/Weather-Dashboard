$(document).ready(function () {
  var runSearch = $("#run-search");

  
  $("#saved-cities").val(localStorage.getItem("#search-field"));

  runSearch.click(function(event) {
    event.preventDefault();
    var searchField = $("#search-field").val();
    console.log(searchField);
    window.localStorage.setItem("#search-field", searchField);
    var savedCities = $("#saved-cities");
    var storedCity = localStorage.getItem("#search-field")
    console.log(storedCity)
    savedCities.append(storedCity)


    $.ajax({
      method: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchField +
        "&units=imperial&appid=53d2f99f562f36701d4bf49111eb24c6",
      dataType: "json",
    }).then(function (response) {
      console.log(response);
      // searchField.empty();
      var dateConv = new Date(response.list[0].dt * 1000).toLocaleDateString(
        "en-US"
      );
      var iconCode = response.list[0].weather[0].icon;
      var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
      console.log(iconURL);

      var uvLat = response.city.coord.lat;
      var uvLon = response.city.coord.lon;
      var uvIndexUrl =
        "http://api.openweathermap.org/data/2.5/uvi?appid=53d2f99f562f36701d4bf49111eb24c6&lat=" +
        uvLat +
        "&lon=" +
        uvLon;

      var weatherField = $("#weather-field");
      var cityName = $("<h4>");
      var dateEl = $("<div>");
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
      weatherField.append(cityName);
      weatherField.append(dateEl);
      weatherField.append(iconImg);
      weatherField.append(tempEl);
      weatherField.append(humidityEl);
      weatherField.append(windEl);
      weatherField.append(uvIndexEl);

      cityName.text(response.city.name);
      dateEl.text(dateConv);
      iconImg.text(iconImg);
      tempEl.text("Temperature: " + response.list[0].main.temp + " °F");
      humidityEl.text("Humidity: " + response.list[0].main.humidity + " %");
      windEl.text("Wind Speed: " + response.list[0].wind.speed + " MPH");
      uvIndexEl.text("UV Index: ");

      for (let i = 0; i < response.list.length; i++) {
         if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                var col = $("<div>").addClass("col-md-2 m-2")
                var fcastCard = $("<div>").addClass("card bg-primary text-white p-2")
                var fcastBody = $("<div>").addClass("card-body p-2")
                var fcastDateEl = $("<h6>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString())
                var fcastIcon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png")
                var fcastTemp = $("<p>").addClass("card-text").text("Temp: " + response.list[i].main.temp + " °F")
                var fcastHumidity = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + " %")
                col.append(fcastCard.append(fcastBody.append(fcastDateEl,fcastIcon,fcastTemp,fcastHumidity)))
                $("#forecast-field").append(col)
            }   
        }

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
    });
  });
});
