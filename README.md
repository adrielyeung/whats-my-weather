# whats-my-weather
A JavaScript front end app to display current weather and forecast.

Built with HTML (Bootstrap), CSS, and functionality provided by Javascript.

Using Open Weather API to obtain weather data, and Google Maps API to obtain geographical information.

## What's new - 
Check back to see new features here!

## How to use
1. Clone the repository into a local directory.
2. The ```keys_sample.js``` is a sample file for storing API keys. For security purposes, please register for your own keys on Open Weather API (https://openweathermap.org/api) and Google Maps API (https://cloud.google.com/maps-platform/).
3. Insert your API keys into ```keys_sample.js```.
4. Rename ```keys_sample.js``` to ```keys.js``` for use.
5. For local runs, it is preferred to run using **Live Server** extension in Visual Studio Code, this prevents the CORS (cross origin request) error from happening.
<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/LiveServer_Img.PNG" alt="Live Server" width="70%" height="70%">

## Description
The front end, ```index.html```, is divided into several sections:
<img src="https://github.com/adrielyeung/whats-my-weather/blob/main/images/WhatsMyWeather.PNG" alt="What's My Weather Front End" width="100%" height="100%">

1. Input area - Custom selection of location.
2. Address area - Displays your browser address (on loading the page), or the address in Input area (on loading a custom location).
3. Time area - Displays the current time in your locale (on loading the page). On loading custom location, also displays current time in that location.
4. Summary area - Displays a description of current weather and current temperature.
5. Detail area - Displays precipitation probability, humidity and wind speed.
6. Forecast area - Displays a 7-day weather forecast (Daily), and 12-hour weather forecast (Hourly), switching between the tabs.

Functionality is provided by ```weather.js``` file.

## Modes of location searching
### Automatic
On loading the page, the page would attempt to load your current address as stored in your browser. Please allow for location tracking to use this feature.

Please refresh the page on changing to another location.

### Manual input
Please input your address/town/city in the Input area and click "Load".

## Future developments
1. Google Map plugin for displaying location.
2. Google Map plugin for selecting custom location.

## Credits
- The Coder Foundry for their fantastic tutorial which this project is based on (https://www.youtube.com/watch?v=DDxy-sCiKQw).
