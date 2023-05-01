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
let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
).textContent = `${month} ${dayOfWeek}, ${dayOfMonth}`;
document.getElementById("time").textContent =
  hours + ":" + minutes + " " + amOrPm;

// Show weather function to display the city name, temperature, and description

let temperatureUnit = "C";
function showWeather(response, setCatImage) {
  let h1 = document.querySelector("h1");
  let temperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  h1.innerHTML = `${response.data.name} ${temperature}°C `;
  let temperatureUnit = "C";
  document.getElementById("description").textContent = description;
  // pass temperature and temperatureUnit to setCatImage function
  setCatImage(temperature);
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
