// Set API key and default city
let apiKey = "50fa4024e3b1d5eac2f51ab18a47e997";
let city = "Quebec City";
// Set API URL with default city and units
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;

// Set current date and time variables
let now = new Date();
let monthsOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = monthsOfYear[now.getMonth()];
let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let dayOfWeek = daysOfWeek[now.getDay()];
let dayOfMonth = now.getDate();
let hours = now.getHours();
let minutes = now.getMinutes();
let amOrPm = hours >= 12 ? "PM" : "AM";
hours %= 12;
hours = hours ? hours : 12;
minutes = minutes < 10 ? "0" + minutes : minutes;

// Set date and time elements
document.getElementById(
  "date"
).textContent = `${dayOfWeek} ${month}, ${dayOfMonth}`;
document.getElementById("time").textContent =
  hours + ":" + minutes + " " + amOrPm;

let forecastElement = document.querySelector("#forecast");
//forecastElement.innerHTML = "";

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//predictions
function displayForecast(response) {
  let forecast = response.data.daily.slice(1);

  let forecastHTML = `<div class="row d-flex justify-content-center align-items-center">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col">
  <div class="card-p shadow card-body">
  <div class="weather-icon-container">
      <div class="card-title-p weather-forecast-date" id="date-p">${formatDay(
        forecastDay.dt
      )}</div>
      <div class="weather-description-p"> ${forecastDay.weather[0].description}
      </div>
        <ul>
        <li>
          <img src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" class="prediction-weather-information" id="weather-icon" width="40">          
          </img>
          </li>
          <li class="list-item card-text prediction-weather-information" id="forecast-temp-p">
            <span class="weather-forecast-temp-max temp">${Math.round(
              forecastDay.temp.max
            )}°</span>
            <small id="min-max-divider">|</small>
            <span class="weather-forecast-temp-min temp">${Math.round(
              forecastDay.temp.min
            )}°</span>
          </li>
        </ul>
        
      </div>
    </div>
  </div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//displayForecast();
//console.log(apiUrl);

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "3bc520cc14bbdedfd7e45158f2ef0439";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Show weather function to display the city name, temperature, and description
function showWeather(response, setCatImage) {
  let city = document.querySelector("#city");
  let temperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  let temp = document.getElementById("temp");
  let iconElement = document.querySelector("#weather-icon");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  city.innerHTML = `${response.data.name}`;
  temp.innerHTML = `${temperature}`;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  document.getElementById("description").textContent = description;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  // pass temperature and temperatureUnit to setCatImage function
  setCatImage(temperature);
  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}

// Search function to handle the form submission and make the API request
function search(event) {
  event.preventDefault();

  // Get the value of the city input field and trim any whitespace
  let cityInput = document.getElementById("city-input").value.trim();

  // Check if the input field is empty
  if (cityInput.length === 0) {
    alert("Please enter a city name.");
    return;
  }

  // Check if the input contains only letters, spaces, and hyphens
  if (!/^[a-zA-Z\s-]+$/.test(cityInput)) {
    alert("Please enter a valid city name.");
    return;
  }

  // Set API URL with the input city and units
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=metric&appid=${apiKey}`;

  // Make the API request with axios and show the weather
  axios
    .get(apiUrl)
    .then(function (response) {
      showWeather(response, function (temperature) {
        const catImage = document.getElementById("cat-image");
        if (temperature > 18) {
          catImage.src = "img/outsideCat.svg";
        } else {
          catImage.src = "img/insideCat.svg";
        }
      });
    })
    .catch(function (error) {
      alert("Could not find weather data for that city.");
    });

  // Clear the input field
  document.getElementById("city-input").value = "";
}

// Get the search form element and add an event listener to handle form submissions
let searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", search);

// Function to get the user's geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to show the user's geolocation weather
function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios
    .get(apiUrl)
    .then(function (response) {
      showWeather(response, function (temperature) {
        const catImage = document.getElementById("cat-image");
        if (temperature > 18) {
          catImage.src = "img/outsideCat.svg";
        } else {
          catImage.src = "img/insideCat.svg";
        }
      });
    })
    .catch(function (error) {
      alert("Could not find weather data for your location.");
    });
}

getLocation();

//Unit conversion

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  celsiuslink.classList.remove("active");
  fahrenheitlink.classList.add("active");
  let FahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(FahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiuslink.classList.add("active");
  fahrenheitlink.classList.remove("active");
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitlink = document.querySelector("#fahrenheit-link");
fahrenheitlink.addEventListener("click", displayFahrenheitTemp);

let celsiuslink = document.querySelector("#celsius-link");
celsiuslink.addEventListener("click", displayCelsiusTemperature);
