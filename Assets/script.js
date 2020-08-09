
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
        var weatherField = $("#weather-field")
        var cityName = $("<div>")
        var date = $("<div>")
        // var s = new Date(1504095567183).toLocaleDateString("en-US")
        var icon = $("<div>")
        var temp = $("<div>")
        var humidity = $("<div>")
        var wind = $("<div>")
        var uvIndex = $("<div>")
        weatherField.append(cityName, temp, humidity, wind, uvIndex)
        cityName.append(date, icon)
        cityName.text(response.city.name)
        console.log(weatherField);


        // for (let i = 0; i < response.docs.length; i++) {
        //     var newDiv = $("<div>")
        //     results.append(newDiv);
        //     newDiv.text(response.docs[i].abstract);
        //     console.log(response.docs);
        // }
    })
})