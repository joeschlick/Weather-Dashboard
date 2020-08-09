
var runSearch = $("#run-search");
var savedCities = $("#saved-cities")

var fcastField = $("#forecast-field")

runSearch.click(function(event){
    event.preventDefault();
    var searchField = $("#search-field").val();
    console.log(searchField);
    $.ajax ({
        method: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchField + "&units=imperial&appid=53d2f99f562f36701d4bf49111eb24c6",
        dataType:"json"
    }).then(function(response){
        console.log(response);
        // searchField.empty();
        var dateConv = new Date((response.list[0].dt)*1000).toLocaleDateString("en-US")
        // console.log(dateConv)
        var weatherField = $("#weather-field")
        var cityName = $("<div>")
        var dateEl = $("<div>")
        // var s = new Date(1504095567183).toLocaleDateString("en-US")
        var iconEl = $("<div>").attr("id", "icon-png" )
        var tempEl = $("<div>")
        var humidityEl = $("<div>")
        var windEl = $("<div>")
        var uvIndexEl = $("<div>")
        weatherField.append(cityName)
        weatherField.append(dateEl)
        weatherField.append(iconEl)
        weatherField.append(tempEl)
        weatherField.append(humidityEl)
        weatherField.append(windEl)
        weatherField.append(uvIndexEl)
        
        cityName.text(response.city.name)
        dateEl.text(dateConv)
        iconEl.text(response.list[0].weather[0].icon)
        tempEl.text("Temperature: " + response.list[0].main.temp + " °F")
        humidityEl.text("Humidity: " + response.list[0].main.humidity + " %")
        


        // for (let i = 0; i < response.docs.length; i++) {
        //     var newDiv = $("<div>")
        //     results.append(newDiv);
        //     newDiv.text(response.docs[i].abstract);
        //     console.log(response.docs);
        // }
    })
})