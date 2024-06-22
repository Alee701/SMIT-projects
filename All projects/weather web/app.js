// app.js

const apiKey = 'a72aa177c7954419821123158242206'; 
const savedCities = new Set();

document.getElementById('add-city-btn').addEventListener('click', addCity);

function addCity() {
    const city = document.getElementById('city-input').value;
    if (city && !savedCities.has(city.toLowerCase())) {
        getWeather(city);
        document.getElementById('city-input').value = '';
        savedCities.add(city.toLowerCase());
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=&q=London&aqi=403`);
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
    const iconUrl = `https:${data.current.condition.icon}`;
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
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/852286/852286-hd_1920_1080_30fps.mp4' : 'https://videos.pexels.com/video-files/852286/852286-hd_1920_1080_30fps.mp4';
    } else if (weatherCondition.includes('cloud')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/5535208/5535208-uhd_2560_1440_30fps.mp4' : 'https://videos.pexels.com/video-files/5535208/5535208-uhd_2560_1440_30fps.mp4';
    } else if (weatherCondition.includes('rain')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/4323285/4323285-hd_1920_1080_30fps.mp4' : 'https://videos.pexels.com/video-files/5170597/5170597-hd_1920_1080_24fps.mp4';
    } else if (weatherCondition.includes('snow')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/857032/857032-hd_1920_1080_30fps.mp4' : 'https://videos.pexels.com/video-files/856381/856381-hd_1920_1080_30fps.mp4';
    } else if (weatherCondition.includes('thunderstorm')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/6190836/6190836-hd_1920_1080_30fps.mp4' : 'https://videos.pexels.com/video-files/5324177/5324177-hd_1280_720_30fps.mp4';
    } else if (weatherCondition.includes('autumn')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/3105317/3105317-hd_1920_1080_24fps.mp4' : 'https://videos.pexels.com/video-files/3105317/3105317-hd_1920_1080_24fps.mp4';
    } else if (weatherCondition.includes('sunset')) {
        videoSrc = 'https://videos.pexels.com/video-files/856973/856973-uhd_2560_1440_25fps.mp4';
    } else if (weatherCondition.includes('sunrise')) {
        videoSrc = 'https://videos.pexels.com/video-files/854638/854638-hd_1920_1080_30fps.mp4';
    } else if (weatherCondition.includes('fog')) {
        videoSrc = 'https://videos.pexels.com/video-files/2534297/2534297-uhd_2560_1440_30fps.mp4';
    } else if (weatherCondition.includes('sunny')) {
        videoSrc = 'https://videos.pexels.com/video-files/2569168/2569168-hd_1920_1080_24fps.mp4';
    } else {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/857251/857251-hd_1620_1080_25fps.mp4' : 'https://videos.pexels.com/video-files/857251/857251-hd_1620_1080_25fps.mp4';
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
    const iconUrl = `https:${data.current.condition.icon}`;

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
            break;
        }
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Add any initial cities you want to display on load
    const initialCities = ['Karachi', 'London'];
    initialCities.forEach(city => getWeather(city));
});
