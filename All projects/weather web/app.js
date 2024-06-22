const apiKey = '1edcd2bca73c4e928f1211628242006'; // Replace with your actual WeatherAPI key
const savedCities = new Set();

document.getElementById('add-city-btn').addEventListener('click', addCity);

function addCity() {
    const city = document.getElementById('city-input').value;
    if (city && !savedCities.has(city.toLowerCase())) {
        getWeather(city);
        document.getElementById('city-input').value = '';
        savedCities.add(city.toLowerCase());
        saveToLocalStorage();
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`);
        if (!response.ok) throw new Error('City not found!');
        const data = await response.json();
        updateCurrentWeather(data);
        renderSavedCity(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateCurrentWeather(data) {
    const city = data.location.name;
    const tempC = data.current.temp_c;
    const desc = data.current.condition.text;
    const iconUrl = data.current.condition.icon;
    const isDay = data.current.is_day;

    document.getElementById('current-city').textContent = city;
    document.getElementById('current-temp').textContent = `Temp: ${tempC.toFixed(1)}° C`;
    document.getElementById('current-desc').textContent = desc;
    document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="${desc}">`;

    updateBackgroundVideo(isDay, desc.toLowerCase());
    updateCurrentWeatherDiv(isDay);

    document.getElementById('additional-info').innerHTML = `
        <div class="additional-info-item">Feels like: ${data.current.feelslike_c.toFixed(1)}° C</div>
        <div class="additional-info-item">Pressure: ${data.current.pressure_mb} hPa</div>
        <div class="additional-info-item">Humidity: ${data.current.humidity}%</div>
        <div class="additional-info-item">Visibility: ${data.current.vis_km * 1000} m</div>
        <div class="additional-info-item">Wind Speed: ${data.current.wind_kph} kph</div>
        <div class="additional-info-item">Wind Direction: ${data.current.wind_degree}°</div>
        <div class="additional-info-item">Cloudiness: ${data.current.cloud}%</div>
    `;
}

function updateBackgroundVideo(isDay, weatherCondition) {
    const videoElement = document.getElementById('bg-video');
    let videoSrc = '';

    if (weatherCondition.includes('clear')) {
        videoSrc = isDay ? 'videos/clear-day.mp4' : 'videos/clear-night.mp4';
    } else if (weatherCondition.includes('cloud')) {
        videoSrc = isDay ? 'videos/cloudy-day.mp4' : 'videos/cloudy-night.mp4';
    } else if (weatherCondition.includes('rain')) {
        videoSrc = isDay ? 'videos/rainy-day.mp4' : 'videos/rainy-night.mp4';
    } else if (weatherCondition.includes('snow')) {
        videoSrc = isDay ? 'videos/snowy-day.mp4' : 'videos/snowy-night.mp4';
    } else if (weatherCondition.includes('thunderstorm')) {
        videoSrc = isDay ? 'videos/thunderstorm-day.mp4' : 'videos/thunderstorm-night.mp4';
    } else if (weatherCondition.includes('autumn')) {
        videoSrc = isDay ? 'videos/autumn-day.mp4' : 'videos/autumn-night.mp4';
    } else if (weatherCondition.includes('sunset')) {
        videoSrc = 'videos/sunset.mp4';
    } else if (weatherCondition.includes('sunrise')) {
        videoSrc = 'videos/sunrise.mp4';
    } else if (weatherCondition.includes('fog')) {
        videoSrc = isDay ? 'videos/fog-day.mp4' : 'videos/fog-night.mp4';
    } else if (weatherCondition.includes('sunny')) {
        videoSrc = 'videos/sunny-day.mp4';
    } else {
        videoSrc = isDay ? 'videos/other-day.mp4' : 'videos/other-night.mp4';
    }

    if (videoElement.src !== videoSrc) {
        videoElement.src = videoSrc;
        videoElement.load();
        videoElement.play();
    }
}

function updateCurrentWeatherDiv(isDay) {
    const currentWeatherDiv = document.getElementById('current-weather');
    if (isDay) {
        currentWeatherDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        currentWeatherDiv.style.color = '#fff';
    } else {
        currentWeatherDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        currentWeatherDiv.style.color = '#000';
    }
}

function renderSavedCity(data) {
    const cityList = document.getElementById('city-list');
    const cityItem = document.createElement('li');
    cityItem.className = 'saved-city';

    const cityName = data.location.name;
    const tempC = data.current.temp_c;
    const iconUrl = data.current.condition.icon;

    cityItem.innerHTML = `
        <span>${cityName}</span>
        <span>${tempC.toFixed(1)}°C</span>
        <img src="${iconUrl}" alt="Weather Icon">
        <button class="remove-btn" data-city="${cityName.toLowerCase()}">Remove</button>
    `;

    cityList.appendChild(cityItem);
    cityItem.querySelector('.remove-btn').addEventListener('click', () => removeCity(cityName.toLowerCase()));
}

function removeCity(city) {
    const cityList = document.getElementById('city-list');
    const cityItems = cityList.getElementsByTagName('li');
    for (let item of cityItems) {
        if (item.querySelector('.remove-btn').dataset.city === city) {
            cityList.removeChild(item);
            savedCities.delete(city);
            saveToLocalStorage();
            break;
        }
    }
}

function saveToLocalStorage() {
    localStorage.setItem('savedCities', JSON.stringify(Array.from(savedCities)));
}

function loadFromLocalStorage() {
    const storedCities = JSON.parse(localStorage.getItem('savedCities'));
    if (storedCities) {
        storedCities.forEach(city => {
            savedCities.add(city);
            getWeather(city);
        });
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
