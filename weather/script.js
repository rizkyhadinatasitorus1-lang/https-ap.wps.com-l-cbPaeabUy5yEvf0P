// Weather API Configuration
const API_KEY = 'ffda7a4b1e02b0fda1e1c0a35f7edcc7'; // OpenWeatherMap Free API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastGrid = document.getElementById('forecastGrid');
const hourlyScroll = document.getElementById('hourlyScroll');
const detailsGrid = document.getElementById('detailsGrid');
const airQualityDiv = document.getElementById('airQuality');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const suggestionsDiv = document.getElementById('suggestions');
const themeToggle = document.getElementById('themeToggle');
const quickBtns = document.querySelectorAll('.quick-btn');

// State
let citySuggestions = [];
let currentWeatherData = null;
let forecastData = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadDefaultCity();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', searchWeather);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchWeather();
    });

    searchInput.addEventListener('input', debounce(handleCitySearch, 300));
    searchInput.addEventListener('blur', function() {
        setTimeout(() => suggestionsDiv.classList.remove('active'), 200);
    });

    locationBtn.addEventListener('click', getCurrentLocation);
    themeToggle.addEventListener('click', toggleTheme);

    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const city = this.getAttribute('data-city');
            searchInput.value = city;
            getWeatherByCity(city);
        });
    });
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Theme Management
function toggleTheme() {
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Search Functionality
async function handleCitySearch(e) {
    const searchTerm = e.target.value.trim();

    if (searchTerm.length < 2) {
        suggestionsDiv.classList.remove('active');
        return;
    }

    try {
        const response = await fetch(
            `${GEO_URL}/direct?q=${searchTerm}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();
        
        if (data.length > 0) {
            citySuggestions = data;
            displaySuggestions(data);
            suggestionsDiv.classList.add('active');
        } else {
            suggestionsDiv.classList.remove('active');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function displaySuggestions(suggestions) {
    suggestionsDiv.innerHTML = suggestions.map((city, index) => `
        <div class="suggestion-item" onclick="selectSuggestion(${index})">
            ${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}
        </div>
    `).join('');
}

function selectSuggestion(index) {
    const city = citySuggestions[index];
    searchInput.value = `${city.name}, ${city.country}`;
    suggestionsDiv.classList.remove('active');
    getWeatherByCoordinates(city.lat, city.lon);
}

// Search Weather
function searchWeather() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    getWeatherByCity(city);
}

// Get Weather by City
async function getWeatherByCity(city) {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        getWeatherByCoordinates(data.coord.lat, data.coord.lon);
        localStorage.setItem('lastCity', city);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// Get Weather by Coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        showLoading(true);
        hideError();

        // Fetch current weather and forecast
        const [weatherResponse, forecastResponse, airQualityResponse] = await Promise.all([
            fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
            fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ]);

        const weather = await weatherResponse.json();
        const forecast = await forecastResponse.json();
        const airQuality = await airQualityResponse.json();

        currentWeatherData = weather;
        forecastData = forecast;

        displayCurrentWeather(weather);
        displayForecast(forecast);
        displayHourlyForecast(forecast);
        displayWeatherDetails(weather);
        displayAirQuality(airQuality);

        showLoading(false);
    } catch (error) {
        showError('Error fetching weather data');
        showLoading(false);
    }
}

// Get Current Location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            showError('Unable to get your location');
            showLoading(false);
        }
    );
}

// Display Current Weather
function displayCurrentWeather(data) {
    const now = new Date();
    const icon = getWeatherIcon(data.weather[0].main);

    const html = `
        <div class="weather-header">
            <div class="weather-location">
                <h2>${data.name}, ${data.sys.country}</h2>
                <p>${data.weather[0].description}</p>
                <p class="last-updated">Last updated: ${now.toLocaleTimeString()}</p>
            </div>
        </div>

        <div class="weather-main">
            <div class="temperature-section">
                <div class="weather-icon">${icon}</div>
                <div class="temperature-display">
                    <div class="current-temp">${Math.round(data.main.temp)}°C</div>
                    <div class="feels-like">Feels like ${Math.round(data.main.feels_like)}°C</div>
                    <div class="weather-description">${capitalizeFirstLetter(data.weather[0].description)}</div>
                </div>
            </div>

            <div class="weather-highlights">
                <div class="highlight-item">
                    <div class="highlight-label">💧 Humidity</div>
                    <div class="highlight-value">${data.main.humidity}%</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-label">💨 Wind Speed</div>
                    <div class="highlight-value">${(data.wind.speed * 3.6).toFixed(1)} km/h</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-label">🌡️ Pressure</div>
                    <div class="highlight-value">${data.main.pressure} mb</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-label">👁️ Visibility</div>
                    <div class="highlight-value">${(data.visibility / 1000).toFixed(1)} km</div>
                </div>
            </div>
        </div>
    `;

    currentWeatherDiv.innerHTML = html;
}

// Display 5-Day Forecast
function displayForecast(data) {
    const dailyForecasts = {};

    // Group forecasts by day
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

    // Get one forecast per day (at noon)
    const forecasts = Object.entries(dailyForecasts)
        .slice(0, 5)
        .map(([date, items]) => {
            const noonItem = items.find(item => new Date(item.dt * 1000).getHours() === 12) || items[0];
            return {
                date,
                ...noonItem
            };
        });

    const html = forecasts.map(forecast => `
        <div class="forecast-card">
            <div class="forecast-date">${new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">${getWeatherIcon(forecast.weather[0].main)}</div>
            <div class="forecast-temp">
                <span class="temp-high">${Math.round(forecast.main.temp_max)}°</span>
                <span class="temp-low">${Math.round(forecast.main.temp_min)}°</span>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
            <div class="forecast-details">
                <div class="forecast-detail">
                    <i class="fas fa-droplets" style="color: #4ecdc4;"></i>
                    <span>${forecast.main.humidity}%</span>
                </div>
                <div class="forecast-detail">
                    <i class="fas fa-wind" style="color: #ff6b6b;"></i>
                    <span>${(forecast.wind.speed * 3.6).toFixed(0)} km/h</span>
                </div>
            </div>
        </div>
    `).join('');

    forecastGrid.innerHTML = html;
}

// Display Hourly Forecast
function displayHourlyForecast(data) {
    const hourlyData = data.list.slice(0, 8); // Next 24 hours (3-hour intervals)

    const html = hourlyData.map(item => {
        const hour = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });
        return `
            <div class="hourly-card">
                <div class="hourly-time">${hour}</div>
                <div class="hourly-icon">${getWeatherIcon(item.weather[0].main)}</div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
                <div class="hourly-humidity">💧 ${item.main.humidity}%</div>
            </div>
        `;
    }).join('');

    hourlyScroll.innerHTML = html;
}

// Display Weather Details
function displayWeatherDetails(data) {
    const details = [
        {
            label: '🌡️ Temperature',
            value: Math.round(data.main.temp),
            unit: '°C'
        },
        {
            label: '🤔 Feels Like',
            value: Math.round(data.main.feels_like),
            unit: '°C'
        },
        {
            label: '📈 Max Temperature',
            value: Math.round(data.main.temp_max),
            unit: '°C'
        },
        {
            label: '📉 Min Temperature',
            value: Math.round(data.main.temp_min),
            unit: '°C'
        },
        {
            label: '💧 Humidity',
            value: data.main.humidity,
            unit: '%'
        },
        {
            label: '💨 Wind Speed',
            value: (data.wind.speed * 3.6).toFixed(1),
            unit: 'km/h'
        },
        {
            label: '🧭 Wind Direction',
            value: getWindDirection(data.wind.deg),
            unit: ''
        },
        {
            label: '🌡️ Pressure',
            value: data.main.pressure,
            unit: 'mb'
        },
        {
            label: '👁️ Visibility',
            value: (data.visibility / 1000).toFixed(1),
            unit: 'km'
        },
        {
            label: '☁️ Cloudiness',
            value: data.clouds.all,
            unit: '%'
        }
    ];

    const html = details.map(detail => `
        <div class="detail-card">
            <div class="detail-label">${detail.label}</div>
            <div class="detail-value">${detail.value}<span class="detail-unit">${detail.unit}</span></div>
        </div>
    `).join('');

    detailsGrid.innerHTML = html;
}

// Display Air Quality
function displayAirQuality(data) {
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;

    const aqiCategories = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiColors = ['#48bb78', '#f6ad55', '#f59e0b', '#f97316', '#dc2626'];

    const html = `
        <h2>🌍 Air Quality Index</h2>
        <div class="aqi-container">
            <div class="aqi-card" style="background: linear-gradient(135deg, ${aqiColors[aqi - 1]} 0%, ${aqiColors[aqi - 1]} 100%);">
                <div class="aqi-label">AQI Level</div>
                <div class="aqi-value">${aqi}</div>
                <div class="aqi-category">${aqiCategories[aqi - 1]}</div>
            </div>
            <div class="aqi-card">
                <div class="aqi-label">PM2.5</div>
                <div class="aqi-value">${(components.pm2_5 || 0).toFixed(1)}</div>
                <div class="aqi-category">µg/m³</div>
            </div>
            <div class="aqi-card">
                <div class="aqi-label">PM10</div>
                <div class="aqi-value">${(components.pm10 || 0).toFixed(1)}</div>
                <div class="aqi-category">µg/m³</div>
            </div>
            <div class="aqi-card">
                <div class="aqi-label">NO₂</div>
                <div class="aqi-value">${(components.no2 || 0).toFixed(1)}</div>
                <div class="aqi-category">µg/m³</div>
            </div>
            <div class="aqi-card">
                <div class="aqi-label">O₃</div>
                <div class="aqi-value">${(components.o3 || 0).toFixed(1)}</div>
                <div class="aqi-category">µg/m³</div>
            </div>
        </div>
    `;

    airQualityDiv.innerHTML = html;
}

// Utility Functions
function getWeatherIcon(weatherType) {
    const icons = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '🌋',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    return icons[weatherType] || '🌤️';
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return `${directions[index]} (${Math.round(degrees)}°)`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showLoading(show) {
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
}

function hideError() {
    errorMessage.classList.remove('active');
}

function loadDefaultCity() {
    const lastCity = localStorage.getItem('lastCity') || 'London';
    getWeatherByCity(lastCity);
}
