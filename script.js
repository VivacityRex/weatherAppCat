// Set API key and default city
let apiKey = "f99c13c91758041c79251683cc1d7b5f";
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
  "December"
];
let month = monthsOfYear[now.getMonth()];
let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

// Show weather function to display the city name, temperature, and description


function showWeather(response, setCatImage) {
  let city = document.querySelector("#city");
  let temperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description; 
  let temp = document.getElementById("temp");
  let iconElement = document.querySelector("#weather-icon");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  city.innerHTML = `${response.data.name}`
  temp.innerHTML =  `${temperature}`;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  document.getElementById("description").textContent = description;
  iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  // pass temperature and temperatureUnit to setCatImage function
  setCatImage(temperature);
  celsiusTemperature = response.data.main.temp;
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