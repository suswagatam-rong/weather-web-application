// Import the API Key
import WEATHER_API_KEY from "./apiKey.js";
//const {WEATHER_API_KEY} = require('./apiKey');


// State initialization
let currentCity = "Kolkata"; // Default city
let units = "metric"; // Default units (metric for Celsius)

// Select various elements from the DOM to display weather information
let city = document.querySelector(".weather-city");
let datetime = document.querySelector(".weather-datetime");
let weather_forecast = document.querySelector('.weather-forecast');
let weather_temperature = document.querySelector(".weather-temperature");
let weather_icon = document.querySelector(".weather-icon");
let weather_minmax = document.querySelector(".weather-minmax");
let weather_feelsLike = document.querySelector('.weather-feels-like');
let weather_humidity = document.querySelector('.weather-humidity');
let weather_wind = document.querySelector('.weather-wind');
let weather_pressure = document.querySelector('.weather-pressure');

// Search event listener
document.querySelector(".weather-search").addEventListener('submit', e => {
	let search = document.querySelector(".weather-search-form");
	// Prevent default form submission
	e.preventDefault();
	// Change current city to the one entered by the user
	currentCity = search.value.trim();
	if (currentCity) {
		// Fetch the weather data for the new city
		getWeather();
		// Clear the search input field
		search.value = "";
	} else {
		alert("Please enter a city name");
	}
});

// Unit conversion to Celsius
document.querySelector(".weather-unit-celsius").addEventListener('click', () => {
	if (units !== "metric") {
		units = "metric"; // Change unit to metric
		getWeather(); // Fetch the weather details
	}
});

// Unit conversion to Fahrenheit
document.querySelector(".weather-unit-fahrenheit").addEventListener('click', () => {
	if (units !== "imperial") {
		units = "imperial"; // Change unit to imperial
		getWeather(); // Fetch the weather details
	}
});

// Convert timestamp to readable date and time
function convertTimeStamp(timestamp, timezone) {
	// Create a new Date object using the timestamp
	const date = new Date(timestamp * 1000);

	// Get the timezone offset in minutes
	const timezoneOffset = date.getTimezoneOffset();

	// Calculate the offset in milliseconds
	const offsetInMilliseconds = timezoneOffset * 60 * 1000;

	// Create a new Date object considering both UTC and timezone offset
	const localTime = new Date(date.getTime() + timezone * 1000 + offsetInMilliseconds);

	// Format the date to the desired string format
	const options = {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	return localTime.toLocaleString("en-US", options);
}

// Convert country code to country name
function convertCountryCode(country) {
	let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
	return regionNames.of(country);
}

// Fetch weather data from OpenWeather API
function getWeather() {
	const API_KEY = WEATHER_API_KEY;
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${API_KEY}&units=${units}`)
		.then(response => response.json())
		.then(data => {
			console.log(data); // Log the data for debugging purposes
			// Update DOM elements with weather data
			city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
			datetime.querySelector('span').innerHTML = convertTimeStamp(data.dt, data.timezone);
			weather_forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
			weather_temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
			weather_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="${data.weather[0].description}" />`;
			weather_minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`;
			weather_feelsLike.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
			weather_humidity.innerHTML = `${data.main.humidity}%`;
			weather_wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
			weather_pressure.innerHTML = `${data.main.pressure} hPa`;
		})
		.catch(error => console.error('Error fetching weather data:', error));
}

// Fetch initial weather data when the DOM content is loaded
document.addEventListener('DOMContentLoaded', getWeather);
