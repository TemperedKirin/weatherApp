
// Switch units function
function switchUnits(unit) {
  const celsiusElements = document.querySelectorAll('.celsius');
  const fahrenheitElements = document.querySelectorAll('.fahrenheit');

  if (unit === 'celsius') {
    celsiusElements.forEach(el => el.style.display = 'inline');
    fahrenheitElements.forEach(el => el.style.display = 'none');
  } else {
    celsiusElements.forEach(el => el.style.display = 'none');
    fahrenheitElements.forEach(el => el.style.display = 'inline');
  }
  
  // Saves unit preference
  localStorage.setItem('tempUnit', unit);
}

async function fetchWeather() {
  // Global variables
  const weatherIcons = {
    "Clear": "fa-sun",
    "Clouds": "fa-cloud",
    "Rain": "fa-cloud-rain",
    "Snow": "fa-snowflake",
    "Mist": "fa-smog",
  }

  

  let searchInput = document.getElementById('search').value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "";

  // Validates searchInput is not empty
  if (searchInput == "") {
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>
    `;
    return;
  }

  // Latitude and longitude coordinates via API
  async function getLonAndLat() {
    const countryCode = 1
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    // Converts Kelvin to Celsius
    function convertKelvinToCelsius(kelvin) {
      return Math.round(kelvin - 273.15);
    }
    // Converts Kelvin to Fahrenheit
    function convertKelvinToFahrenheit(kelvin) {
      return Math.round((kelvin - 273.15) * 9/5 + 32);
    }
    // Converts wind speed from m/s to km/h
    function convertWindSpeed(speed) {
      return (speed * 3.6).toFixed(1);
    }

 


    // Weather info via API
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(weatherURL);

    // Display weather data
    const data = await response.json();

    const tempC = convertKelvinToCelsius(data.main.temp);
    const tempF = convertKelvinToFahrenheit(data.main.temp);
    const feelsLikeC = convertKelvinToCelsius(data.main.feels_like);
    const feelsLikeF = convertKelvinToFahrenheit(data.main.feels_like);

  
    weatherDataSection.style.display = "flex";

    weatherDataSection.innerHTML = `
      <div id="weather-icon">
        <i class="fas ${weatherIcons[data.weather[0].main]}"></i> <!-- Icon Font Awesome -->
      </div>
      <div id="weather-info">
        <h2>${data.name}</h2>

        
        <p class="temperature"><strong>Temperature:</strong> 
          <span class="celsius">${convertKelvinToCelsius(data.main.temp)}°C</span>
          <span class="fahrenheit" style="display:none">${convertKelvinToFahrenheit(data.main.temp)}°F</span>
        </p>
        
        <p class="feels-like"><strong>Feels like:</strong> 
          <span class="celsius">${convertKelvinToCelsius(data.main.feels_like)}°C</span>
          <span class="fahrenheit" style="display:none">${convertKelvinToFahrenheit(data.main.feels_like)}°F</span>
        </p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${convertWindSpeed(data.wind.speed)} km/h</p> <!-- Corregido "k/h" a "km/h" -->
      
        <!-- Unit toggler -->
        <div id="unit-toggle">
          <button onclick="switchUnits('celsius')">°C</button>
          <button onclick="switchUnits('fahrenheit')">°F</button>
        </div>
      </div>
    `;
    document.getElementById("unit-toggle").style.display = "block";
    const savedUnit = localStorage.getItem('tempUnit') || 'celsius';
    switchUnits(savedUnit);
  }

  // Sets value for searchInput, defines geocodeDate with lat and lon, then call the function with lat and lon parameters
  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}