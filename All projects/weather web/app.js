const apiKey = 'dc92936dc587ec90fb7d7cbf1a0bd2a9';
const savedCities = new Set();

document.getElementById('add-city-btn').addEventListener('click', addCity);

function addCity() {
    const city = document.getElementById('city-input').value.trim();
    if (city && !savedCities.has(city.toLowerCase())) {
        getWeather(city);
        document.getElementById('city-input').value = '';
        savedCities.add(city.toLowerCase());
        saveToLocalStorage();
    }
}

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error('City not found!');
        const data = await response.json();
        updateCurrentWeather(data);
        renderSavedCity(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateCurrentWeather(data) {
    const city = data.name;
    const tempC = data.main.temp;
    const desc = data.weather[0].description;
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;

    document.getElementById('current-city').textContent = city;
    document.getElementById('current-temp').textContent = `Temp: ${tempC.toFixed(1)}° C`;
    document.getElementById('current-desc').textContent = desc;
    document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="${desc}">`;

    updateBackgroundVideo(isDay, desc.toLowerCase());
    updateCurrentWeatherDiv(isDay);

    document.getElementById('additional-info').innerHTML = `
        <div class="additional-info-item">Feels like: ${data.main.feels_like.toFixed(1)}° C</div>
        <div class="additional-info-item">Pressure: ${data.main.pressure} hPa</div>
        <div class="additional-info-item">Humidity: ${data.main.humidity}%</div>
        <div class="additional-info-item">Visibility: ${data.visibility} m</div>
        <div class="additional-info-item">Wind Speed: ${data.wind.speed} m/s</div>
        <div class="additional-info-item">Wind Direction: ${data.wind.deg}°</div>
        <div class="additional-info-item">Cloudiness: ${data.clouds.all}%</div>
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
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/856973/856973-uhd_2560_1440_25fps.mp4' : 'https://videos.pexels.com/video-files/856973/856973-uhd_2560_1440_25fps.mp4';
    } else if (weatherCondition.includes('sunrise')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/854638/854638-hd_1920_1080_30fps.mp4' : 'https://videos.pexels.com/video-files/854638/854638-hd_1920_1080_30fps.mp4';
    } else if (weatherCondition.includes('fog')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/2534297/2534297-uhd_2560_1440_30fps.mp4' : 'https://videos.pexels.com/video-files/2534297/2534297-uhd_2560_1440_30fps.mp4';
    } else if (weatherCondition.includes('sunny')) {
        videoSrc = isDay ? 'https://videos.pexels.com/video-files/2569168/2569168-hd_1920_1080_24fps.mp4' : 'https://videos.pexels.com/video-files/2569168/2569168-hd_1920_1080_24fps.mp4';
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

    const cityName = data.name;
    const tempC = data.main.temp;
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

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
