const apiKey="7af1af0879a71a107870d7b875ed13bf";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";


export async function updateWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        let airquality = await getAirQuality(data.coord.lat, data.coord.lon);

        // Update the HTML content
        temp.innerHTML = Math.round(data.main.temp) + "&degC";
        condition.innerHTML = data.weather[0].main;
        humid.innerHTML = data.main.humidity + "%";
        windSpeed.innerHTML = data.wind.speed + " km/h";
        max.innerHTML = data.main.temp_max + "&degC";
        min.innerHTML = data.main.temp_min + "&degC";
        air.innerHTML = airquality;
        if (data.sys.country == undefined) {
            cityName.innerHTML = data.name;
        } else {
            cityName.innerHTML = data.name + "," + data.sys.country;
        }

        // Conditions for Air quality check start
        if (airquality == 1) {
            airType.innerHTML = "Good";
        } else if (airquality == 2) {
            airType.innerHTML = "Fair";
        } else if (airquality == 3) {
            airType.innerHTML = "Moderate";
        } else if (airquality == 4) {
            airType.innerHTML = "Poor";
        } else if (airquality == 5) {
            airType.innerHTML = "Very Poor";
        }
        // Conditions for Air quality check ends

        // Conditions for weather conditions check start
        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        } else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "images/snow.png";
        }
        // Conditions for weather conditions check ends

        // Date and time update start
        const localDateTime = luxon.DateTime.fromMillis((data.dt + data.timezone) * 1000).setZone(data.timezone / 3600); // Convert the time to the local time zone
        const formattedDate = localDateTime.toLocaleString({
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
        const formattedTime = localDateTime.toLocaleString({
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        // Update date and time elements
        dayElement.innerHTML = formattedDate.split(',')[0];
        dateElement.innerHTML = formattedDate.split(',')[1];
        timeElement.innerHTML = formattedTime.split(',')[0];

        // Date and time update end
    } catch (error) {
        console.error('Error updating weather by location:', error);
    }
}
