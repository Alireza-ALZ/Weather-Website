import { showModal, removeModal } from "./utils/modal.js";
import { DAYS, dayIndex } from "./utils/customDate.js";

const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEY = "069d32ced3eee12dc039cc09eb4bad07";
const inputCityName = document.querySelector("#input-city-name");
const searchButton = document.querySelector("#search-button");
const currentWeather = document.querySelector("#current-weather");
const forecastWeather = document.querySelector("#forecast");
const locationIcon = document.querySelector("#location-icon");
const modalButton = document.querySelector("#modal-button");

async function searchHandler() {
  const cityName = inputCityName.value.trim();
  if (!cityName) {
    showModal("Please enter city name !");
    return;
  } else {
    const weatherObject = await weather(cityName);
    const forecastObject = await forecast(cityName);
    if (weatherObject.cod == 200 && forecastObject.cod == 200) {
      renderWeather(weatherObject);
      renderForecast(forecastObject);
    } else {
      showModal("An error occured ! try again later...");
      return;
    }
  }
}

async function weather(city) {
  const response = await fetch(
    `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const json = await response.json();
  return json;
}

async function forecast(city) {
  const response = await fetch(
    `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  const json = await response.json();
  return json;
}

function renderWeather(obj) {
  const showCurrentWeather = `
    <h1>${obj.name} , ${obj.sys.country}</h1>
    <div id="main">
      <img alt="weather-icon" src="https://openweathermap.org/img/w/${
        obj.weather[0].icon
      }.png"/>
      <span>${obj.weather[0].main}</span>
      <p>${Math.round(obj.main.temp)} °C</p>
    </div>
    <div id="info">
      <p>Humidity : <span>${obj.main.humidity}%</span></p>
      <p>Wind Speed : <span>${obj.wind.speed} m/s</span></p>
    </div>
  `;
  currentWeather.innerHTML = showCurrentWeather;
}

function renderForecast(obj) {
  forecastWeather.innerHTML = "";
  const filteredData = obj.list.filter((data) =>
    data.dt_txt.includes("12:00:00")
  );
  filteredData.forEach((day) => {
    const showForecastWeather = `
      <div>
        <img alt="weather-icon" src="https://openweathermap.org/img/w/${
          day.weather[0].icon
        }.png" />
        <h3>${DAYS[dayIndex(day.dt)]}</h3>
        <p>${Math.round(day.main.temp)} °C</p>
        <span>${day.weather[0].main}</span>
      </div>
    `;
    forecastWeather.innerHTML += showForecastWeather;
  });
}

async function positionCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const response = await fetch(
    `${BASE_URL}weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  );
  const json = await response.json();
  const response2 = await fetch(
    `${BASE_URL}forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  );
  const json2 = await response2.json();
  renderWeather(json);
  renderForecast(json2);
}

function errorCallback() {
  showModal("Check premission please...");
}

function locationHandler() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("Please allow for location premission !");
  }
}

async function defaultLocation() {
  const weatherObject = await weather("tehran");
  const forecastObject = await forecast("tehran");
  if (weatherObject.cod == 200 && forecastObject.cod == 200) {
    renderWeather(weatherObject);
    renderForecast(forecastObject);
  } else {
    showModal("An error occured ! try again later...");
    return;
  }
}

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", defaultLocation);
