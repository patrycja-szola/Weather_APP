function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${weekday}, ${hours}:${minutes}`;
}

// Weather API

let apiKey = "1a503fb7a97ad8050479d85fae658043";
let units = "metric";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=${units}&appid=${apiKey}`;

function showTemperature(response) {
  console.log(response.data);
  let cityElement = document.querySelector("#choosen-city");
  let countryElement = document.querySelector("#country");
  let descriptionElement = document.querySelector("#description");
  let temperatureElement = document.querySelector("#temperature");
  let pressureElement = document.querySelector("#pressure");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#dayTime");
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  descriptionElement.innerHTML = response.data.weather[0].description;
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  pressureElement.innerHTML = response.data.main.pressure;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

axios.get(apiUrl).then(showTemperature);

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  axios.get(`${apiUrl}&lat=${lat}&lon=${lon}`).then(showTemperature);

  let newApiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  let newCity2 = document.querySelector("#choosen-city");
  let currentLocation = axios.get(newApiUrl);
  newCity2.innerHTML = `${currentLocation.value}`;
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let defaultCity = "Tczew";
let newCity = document.querySelector("#choosen-city");
newCity.innerHTML = defaultCity;
axios.get(`${apiUrl}&q=${defaultCity}`).then(showTemperature);

function findAlert(event) {
  event.preventDefault();

  let city = document.querySelector("#selected-city");
  let newCity = document.querySelector("#choosen-city");
  newCity.innerHTML = `${city.value}`;
  axios.get(`${apiUrl}&q=${city.value}`).then(showTemperature);
}

let citySearch = document.querySelector("#findButton");
citySearch.addEventListener("click", findAlert);

let locationButton = document.querySelector("#currentLocationButton");
locationButton.addEventListener("click", getCurrentPosition);
