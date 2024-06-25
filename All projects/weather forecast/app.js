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
        <p><img id="detail-icon" src="https://cdn-icons-png.flaticon.com/128/5664/5664993.png" alt="Humidity"> Humidity: ${data.current.humidity}%</p>
        <p><img id="detail-icon" src="https://cdn-icons-png.flaticon.com/128/2676/2676047.png" alt="Wind"> Wind: ${data.current.wind_kph} kph</p>
        <p><img id="detail-icon" src="https://cdn-icons-png.flaticon.com/128/4115/4115904.png" alt="Pressure"> Pressure: ${data.current.pressure_mb} mb</p>
        <p><img id="detail-icon" src="https://cdn-icons-png.flaticon.com/256/3923/3923762.png" alt="Feels Like"> Feels Like: ${data.current.feelslike_c}°C</p>
        <p><img id="detail-icon" src="assets/uv.png" alt="UV Index"> UV Index: ${data.current.uv}</p>
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
        videoSrc = 'https://videos.pexels.com/video-files/2569168/2569168-hd_1920_1080_24fps.mp4';
    } else if (conditionText.includes('rain')) {
        videoSrc = 'https://videos.pexels.com/video-files/5170597/5170597-hd_1920_1080_24fps.mp4';
    } else if (conditionText.includes('thunder')) {
        videoSrc = 'https://videos.pexels.com/video-files/6190836/6190836-hd_1920_1080_30fps.mp4';
    } else if (conditionText.includes('fog')) {
        videoSrc = 'https://videos.pexels.com/video-files/2534297/2534297-uhd_2560_1440_30fps.mp4';
    } else if (conditionText.includes('snow')) {
        videoSrc = 'https://videos.pexels.com/video-files/857032/857032-hd_1920_1080_30fps.mp4';
    } else if (conditionText.includes('cloudy')) {
        videoSrc = 'https://videos.pexels.com/video-files/5535208/5535208-uhd_2560_1440_30fps.mp4';
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
