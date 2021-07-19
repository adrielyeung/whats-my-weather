const wDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const wMonth = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

function fetchWeatherReport(apiKey, latitude, longitude, displayLocationTime) {
    var openWeatherLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=minutely,alerts&appid=${apiKey}`;
    var openWeatherIconLink;

    var summary;
    var temperature;
    var iconId;
    var humidity;
    var precipProbability;
    var windSpeed;
    var currentTime;
    var forecastDate;
    var adjustedTime;
    var forecastDateLocation;
    var timeZoneOffset;

    fetch(openWeatherLink)
    .then(response => {
        return response.json();
    })
    .then(data => {
        summary = data.current.weather[0].main;
        temperature = data.current.temp;
        iconId = data.current.weather[0].icon;
        openWeatherIconLink = `http://openweathermap.org/img/wn/${iconId}@2x.png`;

        humidity = data.current.humidity;
        windSpeed = data.current.wind_speed;
        // dt is time (in s) from 1970/1/1 (Unix time),
        // convert into ms to init a JavaScript date object
        currentTime = new Date(data.current.dt * 1000);
        // Get timezone to calculate location time
        timeZoneOffset = data.timezone_offset;
        adjustedTime = calculateLocationTime(currentTime, timeZoneOffset);
        
        forecastDate = `${wDay[currentTime.getDay()]}, ` +
            `${currentTime.getDate()} ` +
            `${wMonth[currentTime.getMonth()]}, ${currentTime.getFullYear()} ` +
            `${padToTwoDigits(currentTime.getHours())}:` +
            `${padToTwoDigits(currentTime.getMinutes())}:` +
            `${padToTwoDigits(currentTime.getSeconds())}`;
        
        forecastDateLocation = "Their time now: " +
            `${wDay[adjustedTime.getUTCDay()]}, ` +
            `${adjustedTime.getUTCDate()} ` +
            `${wMonth[adjustedTime.getUTCMonth()]}, ${adjustedTime.getUTCFullYear()} ` +
            `${padToTwoDigits(adjustedTime.getUTCHours())}:` +
            `${padToTwoDigits(adjustedTime.getUTCMinutes())}:` +
            `${padToTwoDigits(adjustedTime.getUTCSeconds())}`;

        // Hourly precipitation probability, first hour is the current hour
        precipProbability = data.hourly[0].pop;

        // Set values for the current conditions
        if (displayLocationTime) {
            document.getElementById("currentDate").innerHTML =
                "<p style=\"margin: 0px\">Your time now: " + forecastDate +
                "</p><p style=\"margin: 0px\">" +
                forecastDateLocation + "</p>";
        } else {
            document.getElementById("currentDate").innerHTML = forecastDate;
        }
        document.getElementById("summary").innerHTML = summary;
        document.getElementById("currentTemp").innerHTML =
            `${Math.round(temperature)}&degC`;
        document.getElementById("precipitation").innerHTML = 
            `Precipitation ${Math.round(precipProbability*100)}%`;
        document.getElementById("humidity").innerHTML =
            `Humidity ${Math.round(humidity)}%`;
        document.getElementById("wind").innerHTML =
            `Winds ${Math.round(windSpeed)} m/s`;
        document.getElementById("weatherIcon").src = openWeatherIconLink;

        // Render the forcasts tabs
        document.getElementById("dailyForecast").innerHTML =
            renderDailyForecast(data.daily, timeZoneOffset);
        document.getElementById("hourlyForecast").innerHTML =
            renderHourlyForecast(data.hourly, timeZoneOffset);
    })
    .catch(err => {
        throw (`Sorry, an error occurred ${err}`);
    });
}

function renderDailyForecast(forecastData, timeZoneOffset) {
    var resultsHTML = "<tr><th>Day</th>" +
        "<th>Conditions</th>" +
        "<th style=\"text-align: center; vertical-align: middle;\">High (&degC)</th>" +
        "<th style=\"text-align: center; vertical-align: middle;\">Low (&degC)</th></tr>";
    var rowCount = forecastData.length;
    var forecast;
    var forecastTime;
    var forecastDate;
    var adjustedTime;
    var summary;
    var tempHigh;
    var tempLow;

    // Display only data of today and next 7 days
    if (rowCount > 8) {
        rowCount = 8;
    }

    for (var i = 0; i < rowCount; i++) {
        forecast = forecastData[i];
        // Daily forecast is at 12pm of each locale,
        // to calculate actual date at locale, subtract away the 12-hour offset
        forecastTime = new Date(forecast.dt * 1000);
        adjustedTime = calculateLocationTime(forecastTime, timeZoneOffset);

        forecastDate = `${wDay[adjustedTime.getUTCDay()]}, ${adjustedTime.getUTCDate()} ` +
            `${wMonth[adjustedTime.getUTCMonth()]}`;
        summary = forecast.weather[0].description;
        // Capitalise first letter of description
        summary = summary.charAt(0).toUpperCase() + summary.substring(1);
        tempHigh = Math.round(forecast.temp.max);
        tempLow = Math.round(forecast.temp.min);

        resultsHTML += renderRow(forecastDate, summary, tempHigh, tempLow);
    }

    return resultsHTML;
}

function renderHourlyForecast(forecastData, timeZoneOffset) {
    var resultsHTML = "<tr><th>Time</th>" +
        "<th>Conditions</th>" +
        "<th style=\"text-align: center; vertical-align: middle;\">Temp (&degC)</th>" +
        "<th style=\"text-align: center; vertical-align: middle;\">Precip (%)</th></tr>";
    var rowCount = forecastData.length;
    var forecast;
    var forecastTime;
    var forecastHour;
    var adjustedTime;
    var summary;
    var temp;
    var precipProbability;

    // Display only data of this hour and next 12 hours
    if (rowCount > 13) {
        rowCount = 13;
    }

    for (var i = 0; i < rowCount; i++) {
        forecast = forecastData[i];
        forecastTime = new Date(forecast.dt * 1000);
        adjustedTime = calculateLocationTime(forecastTime, timeZoneOffset);

        forecastHour = `${padToTwoDigits(adjustedTime.getUTCHours())}:` +
            `${padToTwoDigits(adjustedTime.getUTCMinutes())}`;
        summary = forecast.weather[0].description;
        // Capitalise first letter of description
        summary = summary.charAt(0).toUpperCase() + summary.substring(1);
        temp = Math.round(forecast.temp);
        precipProbability = Math.round(forecast.pop * 100);

        resultsHTML += renderRow(forecastHour, summary, temp, precipProbability);
    }

    return resultsHTML;
}

function renderRow(forecastDate, summary, tempHigh, tempLow) {
    return `<tr><td>${forecastDate}</td>` +
    `<td>${summary}</td>` +
    `<td style="text-align: center; vertical-align: middle;">${tempHigh}</td>` +
    `<td style="text-align: center; vertical-align: middle;">${tempLow}</td></tr>`;
}

function padToTwoDigits(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

function fetchLocation(apiKey, latitude, longitude) {
    var googleApiLink = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    // Get Google API response
    fetch(googleApiLink)
    .then(response => {
        // Get response as JSON
        return response.json();
    })
    .then(data => {
        // Work with JSON object
        // Get the formatted address of location
        document.getElementById("location").innerHTML = data.results[4].formatted_address;
        document.getElementById("latlong").innerHTML = "Lat: " + latitude + " Long: " + longitude;
    })
    .catch (err => {
        throw(`Sorry, an error occurred ${err}`);
    });
}

function convertLocationToLatLon() {
    var inputAddress = document.getElementById("inputLocation").value;
    var googleGeocodeLink = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(inputAddress)}&key=${googleApiKeys}`;
    var geocodeResult;

    fetch(googleGeocodeLink)
    .then(response => {
        // Get response as JSON
        return response.json();
    })
    .then(data => {
        geocodeResult = data.results[0];
        document.getElementById("location").innerHTML = geocodeResult.formatted_address;
        document.getElementById("latlong").innerHTML = "Lat: " + geocodeResult.geometry.location.lat + " Long: " + geocodeResult.geometry.location.lng;
        fetchWeatherReport(openWeatherKey, geocodeResult.geometry.location.lat,
            geocodeResult.geometry.location.lng, true);
    })
}

// Calculate the time at location timezone
function calculateLocationTime(currentTime, timeZoneOffset) {
    var adjustedTime = currentTime.getTime() + timeZoneOffset * 1000;
    return new Date(adjustedTime);
}

// Find the lat and lon of user's location
function intiGeoLocation() {
    // Get browser geolocation to load data of current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, fail);
    } else {
        alert("Sorry, you browser does not support geolocation services. " +
            "Please enter your address/city/town to load the weather.");
    }
}

function success(position) {
    // Add keys to API (in keys.js file)
    fetchLocation(googleApiKeys, position.coords.latitude,
        position.coords.longitude);
    fetchWeatherReport(openWeatherKey, position.coords.latitude,
        position.coords.longitude, false);
}

function fail() {
    alert("Sorry, you browser does not support geolocation services. " +
        "Please enter your address/city/town to load the weather.");
}
