window.addEventListener('load', () => {
    const appid = "d3f3a83ea3b8a4eb6de18f4810d5c3cc";
    let long;
    let lat;
    const temperatureDescription = document.querySelector(".temperature-description");
    const temperatureDegree = document.querySelector(".temperature-degree");
    const temperatureUnit = document.querySelector(".temperature-unit");
    const locationTimezone = document.querySelector(".location-timezone");
    const locationName = document.querySelector(".location-name");
    const iconElement = document.querySelector(".icon");
    const humidityElement = document.querySelector(".humidity");
    const windSpeedElement = document.querySelector(".wind-speed");
    const rainfallElement = document.querySelector(".rainfall");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            try {
                const queryParams = new URLSearchParams({
                    lat: lat,
                    lon: long,
                    appid: appid,
                    lang: "ja",
                    units: "metric"
                });
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${queryParams}`;
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('APIからのレスポンスが失敗しました');
                }

                const data = await response.json();
                updateWeatherData(data);
            } catch (error) {
                console.error('APIからのデータ取得エラー:', error);
            }
        });
    }

    function updateWeatherData(data) {
        const { main, weather, sys, name } = data;
        const { temp, humidity } = main;
        const { icon } = weather[0];
        const { country } = sys;
        const { speed } = data.wind;
        const rain = data.rain ? data.rain['1h'] : 0;

        temperatureDegree.textContent = temp.toFixed(1);
        temperatureUnit.textContent = "°C";
        temperatureDescription.textContent = weather[0].main;
        locationTimezone.textContent = country;
        locationName.textContent = name;
        humidityElement.textContent = `湿度: ${humidity}%`;
        windSpeedElement.textContent = `風速: ${speed} m/s`;
        rainfallElement.textContent = `雨量: ${rain} mm`;
        setIcon(icon);
    }


    function setIcon(iconCode) {
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        iconElement.setAttribute('src', iconUrl);
        iconElement.setAttribute('alt', iconCode);
    }
});