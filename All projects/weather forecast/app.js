const apiKey = 'a72aa177c7954419821123158242206';

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather('London');
    setTimeout(() => {
        document.getElementById('initial-video-container').style.display = 'none';
    }, 3000); // Adjust this time as needed
});

function fetchWeather(city) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
        .then(response => response.json())
        .then(data => updateWeather(data))
        .catch(error => console.error('Error fetching weather:', error));
}

function updateWeather(data) {
    const cityName = document.getElementById('city-name');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const condition = document.getElementById('condition');
    const backgroundVideo = document.getElementById('background-video');
    const weatherContainer = document.querySelector('.weather-container');
    const weatherDetail = document.querySelector('.weather-detail');
    const detailsContainer = document.getElementById('details-container');

    cityName.textContent = data.location.name;
    weatherIcon.style.backgroundImage = `url(${data.current.condition.icon})`;
    temperature.textContent = `${data.current.temp_c}°C`;
    condition.textContent = data.current.condition.text;

    // Update detailed weather information
    detailsContainer.innerHTML = `
        <p>Humidity: ${data.current.humidity}%</p>
        <p>Wind: ${data.current.wind_kph} kph</p>
        <p>Pressure: ${data.current.pressure_mb} mb</p>
        <p>Feels Like: ${data.current.feelslike_c}°C</p>
        <p>UV Index: ${data.current.uv}</p>
    `;
    weatherDetail.classList.add('active');

    // Update background and div colors based on day/night
    const isDay = data.current.is_day === 1;
    let videoSrc = isDay ? 'day.mp4' : 'night.mp4';
    let containerBgColor = isDay ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    let detailBgColor = isDay ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';

    backgroundVideo.src = videoSrc;
    weatherContainer.style.backgroundColor = containerBgColor;
    weatherDetail.style.backgroundColor = detailBgColor;

    const conditionText = data.current.condition.text.toLowerCase();
    if (conditionText.includes('sunny')) {
        videoSrc = 'https://videos.pexels.com/video-files/6989014/6989014-sd_640_360_25fps.mp4';
    } else if (conditionText.includes('rain')) {
        videoSrc = 'rain.mp4';
    } else if (conditionText.includes('thunder')) {
        videoSrc = 'thunderstorm.mp4';
    } else if (conditionText.includes('fog')) {
        videoSrc = 'fog.mp4';
    } else if (conditionText.includes('snow')) {
        videoSrc = 'snow.mp4';
    }

    backgroundVideo.src = videoSrc;
}

function searchCity(event) {
    if (event.key === 'Enter') {
        const searchValue = event.target.value;
        fetchWeather(searchValue);
        updateSearchList(searchValue);
    }
}

function updateSearchList(city) {
    const searchList = document.getElementById('search-list');
    const searchItem = document.createElement('div');
    searchItem.className = 'search-item';

    const searchContent = document.createElement('span');
    searchContent.textContent = city;

    const removeButton = document.createElement('button');
    removeButton.textContent = '✖';
    removeButton.onclick = () => searchItem.remove();

    searchItem.appendChild(searchContent);
    searchItem.appendChild(removeButton);

    searchItem.addEventListener('click', () => fetchWeather(city));
    searchList.appendChild(searchItem);

    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
        .then(response => response.json())
        .then(data => {
            const tempSpan = document.createElement('span');
            tempSpan.textContent = ` ${data.current.temp_c}°C`;
            tempSpan.style.marginLeft = '10px';
            searchContent.appendChild(tempSpan);
        })
        .catch(error => console.error('Error fetching temperature:', error));
}
