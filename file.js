// Get references to theme elements
// Get references to theme elements
// Toggle navbar on mobile devices
const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.querySelector('.navbar-links');

navbarToggle.addEventListener('click', () => {
  navbarLinks.classList.toggle('active');
});

const themeSelector = document.getElementById("theme");
const customThemeOptions = document.getElementById("customThemeOptions");
const bgColorInput = document.getElementById("bgColor");
const textColorInput = document.getElementById("textColor");
const applyCustomThemeButton = document.getElementById("applyCustomTheme");

// Function to reset inline styles
function resetCustomStyles() {
  const body = document.body;

  // Clear inline styles on the body
  body.style.backgroundColor = "";
  body.style.color = "";

  // Clear inline styles on city cards
  const cards = document.querySelectorAll(".city-card");
  cards.forEach((card) => {
    card.style.backgroundColor = "";
    card.style.color = "";
  });
}

// Function to apply theme
function applyTheme(theme) {
  const body = document.body;

  // Remove all previous themes
  body.classList.remove("theme-light", "theme-dark");

  // Reset custom styles when switching away from custom theme
  resetCustomStyles();

  if (theme === "light") {
    body.classList.add("theme-light");
    customThemeOptions.classList.add("hidden");
  } else if (theme === "dark") {
    body.classList.add("theme-dark");
    customThemeOptions.classList.add("hidden");
  } else if (theme === "custom") {
    customThemeOptions.classList.remove("hidden");
  }
}

// Apply custom theme
function applyCustomTheme() {
  const body = document.body;

  const bgColor = bgColorInput.value;
  const textColor = textColorInput.value;

  body.style.backgroundColor = bgColor;
  body.style.color = textColor;

  // Apply styles to weather cards too
  const cards = document.querySelectorAll(".city-card");
  cards.forEach((card) => {
    card.style.backgroundColor = bgColor;
    card.style.color = textColor;
  });
}

// Event Listeners
themeSelector.addEventListener("change", (e) => applyTheme(e.target.value));
applyCustomThemeButton.addEventListener("click", applyCustomTheme);


const apiKey = "b8253b57c7b64d075340da85723af512"; // Replace with your API key

// Handle city search form submission
document.getElementById("weatherForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const city = document.getElementById("cityInput").value;
  if (city) {
    getCityWeather(city);
    getFiveDayForecast(city);
  }
});

// Fetch current weather for a city
function getCityWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        document.getElementById("cityName").textContent = data.name;
        document.getElementById(
          "temperature"
        ).textContent = `Temperature: ${data.main.temp}°C`;
        document.getElementById(
          "description"
        ).textContent = `Description: ${data.weather[0].description}`;

        // Add click listener to show detailed weather
        document
          .getElementById("weatherResult")
          .addEventListener("click", () => showWeatherDetails(data));
      }
    });
}

// Fetch 5-day weather forecast for a city
function getFiveDayForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "200") {
        const forecastContainer = document.getElementById("fiveDayForecast");
        const forecastTitle = document.getElementById("forecastTitle");
        forecastContainer.innerHTML = ""; // Clear previous forecast

        // Set the title dynamically
        forecastTitle.textContent = `5-Day Weather Forecast for ${city}`;

        const dailyForecasts = data.list.filter((forecast) =>
          forecast.dt_txt.includes("12:00:00")
        );

        dailyForecasts.forEach((forecast) => {
          const forecastCard = document.createElement("div");
          forecastCard.classList.add("forecast-card");

          const date = document.createElement("h3");
          date.textContent = new Date(forecast.dt_txt).toLocaleDateString();

          const temp = document.createElement("p");
          temp.textContent = `Temp: ${forecast.main.temp}°C`;

          const desc = document.createElement("p");
          desc.textContent = forecast.weather[0].description;

          const icon = document.createElement("img");
          icon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
          icon.alt = forecast.weather[0].description;

          forecastCard.appendChild(date);
          forecastCard.appendChild(icon);
          forecastCard.appendChild(temp);
          forecastCard.appendChild(desc);

          forecastContainer.appendChild(forecastCard);
        });
      }
    });
}
window.addEventListener("load", function () {
  const defaultCity = "Islamabad";
  getFiveDayForecast(defaultCity); // Fetch forecast for Islamabad by default
});

// Show detailed weather information in a modal
function showWeatherDetails(data) {
  document.getElementById("modalCityName").textContent = data.name;
  document.getElementById(
    "modalTemperature"
  ).textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById(
    "modalDescription"
  ).textContent = `Description: ${data.weather[0].description}`;
  document.getElementById(
    "modalHumidity"
  ).textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById(
    "modalWindSpeed"
  ).textContent = `Wind Speed: ${data.wind.speed} m/s`;
  document.getElementById(
    "modalPressure"
  ).textContent = `Pressure: ${data.main.pressure} hPa`;

  document.getElementById("weatherModal").style.display = "block";
}

// Close the modal
document.querySelector(".close-button").addEventListener("click", function () {
  document.getElementById("weatherModal").style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("weatherModal")) {
    document.getElementById("weatherModal").style.display = "none";
  }
});

// Fetch weather for predefined cities
function displayCityCards() {
  const cities = ["Islamabad", "Istanbul", "Edinburgh", "London", "Tokyo"];
  const topCitiesContainer = document.getElementById("topCities");
  topCitiesContainer.innerHTML = "";

  cities.forEach((city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === 200) {
          const cityCard = createCityCard(data);
          topCitiesContainer.appendChild(cityCard);

          cityCard.addEventListener("click", () => showWeatherDetails(data));
        }
      });
  });
}


// Create a city card
function createCityCard(data) {
  const card = document.createElement("div");
  card.classList.add("city-card");

  const cityName = document.createElement("h3");
  cityName.textContent = data.name;

  const temperature = document.createElement("p");
  temperature.textContent = `Temperature: ${data.main.temp}°C`;

  const description = document.createElement("p");
  description.textContent = data.weather[0].description;

  // Add weather icon
  const icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  icon.alt = data.weather[0].description;
  icon.classList.add("weather-icon"); // Optional: Add a class for styling

  card.appendChild(cityName);
  card.appendChild(icon); // Append the icon
  card.appendChild(temperature);
  card.appendChild(description);

  return card;
}


// Initialize top cities on page load
displayCityCards();
