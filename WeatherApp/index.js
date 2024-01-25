

//importing the getAirQuality function from the aqi.js file.
import{
    getAirQuality,
}from './aqi.js';
import{
    getDeviceLocation,
}from './location.js';

const apiUrl2="https://api.opencagedata.com/geocode/v1/json?q=";
const apiKey2="7a49a9d2029440ba91a081c0b00c3abe";
const apiKey1="ea77b27a1760fcfa9b16541e066e86f8";
const apiUrl1="https://api.openweathermap.org/data/2.5/onecall?";
// const apiKey="7af1af0879a71a107870d7b875ed13bf";
// const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";  &key=
const apiUrl="https://api.opencagedata.com/geocode/v1/json?q=";
const apiKey="7a49a9d2029440ba91a081c0b00c3abe"
// Query Selectors start
const searchBox=document.querySelector(".search input");
const searchbtn=document.querySelector(".search .submit");
const reset=document.querySelector(".search .reset");
const currentBtn = document.querySelector(".currentBtn");

const weatherIcon=document.querySelector(".weather_icon");
const condition=document.querySelector(".cond");
let cityName=document.querySelector(".city");
const temp=document.querySelector(".temp");
const humid=document.querySelector(".humidi");
const windSpeed=document.querySelector(".wind");
const max=document.querySelector(".maxTemp");
const min=document.querySelector(".minTemp");
const air=document.querySelector(".air");
const airType=document.querySelector(".airtype");
const dayElement = document.querySelector(".day");
const dateElement = document.querySelector(".date");
const timeElement = document.querySelector(".time");

// Query Selectors end

getDeviceLocation();
// 52.3877830 %2C 9.7334394 &key=


async function updateWeatherByLocation(lat, lon) {
    try {
        console.log('Fetching weather based on device location...');
        const response = await fetch(`${apiUrl1}lat=${lat}&lon=${lon}&appid=${apiKey1}&units=metric&exclude=minutely,hourly`);
        const data = await response.json();
        // console.log(data);
        let airquality = await getAirQuality(data['lat'], data['lon']);

        // Update the HTML content
        temp.innerHTML = Math.round(data['current']['temp']) + "&degC";
        condition.innerHTML = data.daily[0].weather[0].main;
        humid.innerHTML = data['current']['humidity'] + "%";
        windSpeed.innerHTML = data.current.wind_speed + "km/h";
        max.innerHTML = data.daily[0].temp.max + "&degC";
        min.innerHTML = data.daily[0].temp.min + "&degC";
        air.innerHTML = airquality;

    //     // Conditions for Air quality check start
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
    //     // Conditions for Air quality check ends

    //     // Conditions for weather conditions check start
        if (data.daily[0].weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.daily[0].weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.daily[0].weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.daily[0].weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.daily[0].weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        } else if (data.daily[0].weather[0].main == "Snow") {
            weatherIcon.src = "images/snow.png";
        }
    //     // Conditions for weather conditions check ends

    //     // Date and time update start
        
        // Date and time update end
    } catch (error) {
        console.error('Error updating weather by location:', error);
    }
}
async function cityUpdate(lat,lon){
    try{
        const response=await fetch(`${apiUrl2}${lat}%2C${lon}&key=${apiKey2}`);
        const newdata=await response.json();
        console.log(newdata.results[0].components.city+newdata.results[0].components.state);
        newdata.results[0].components.city!=undefined?
        cityName.innerHTML=newdata.results[0].components.city+","+newdata.results[0].components.country:
        cityName.innerHTML=newdata.results[0].components.state+","+newdata.results[0].components.country;
        // if(newdata.results[0].components.city == undefined){
        //     cityName.innerHTML=searchBox.value+","+newdata.results[0].components.country; 
        // }
        updateWeatherByLocation(newdata.results[0].geometry.lat,newdata.results[0].geometry.lng);

        const localDateTime = luxon.DateTime.fromMillis((newdata.timestamp.created_unix + newdata.results[0].annotations.timezone.offset_sec) * 1000).setZone(newdata.results[0].annotations.timezone.offset_sec / 3600); // Convert the time to the local time zone
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

    }
    catch (error) {
        console.error('Error updating weather by location:', error);
    }
}
async function cityUpdateforsearch(lat,lon){
    try{
        const response=await fetch(`${apiUrl2}${lat}%2C${lon}&key=${apiKey2}`);
        const newdata=await response.json();
        console.log(newdata.results[0].components.city+newdata.results[0].components.state);
        // newdata.results[0].components.city!=undefined?
        cityName.innerHTML=newdata.results[0].components.city+","+newdata.results[0].components.country;
        // cityName.innerHTML=newdata.results[0].components.state+","+newdata.results[0].components.country;
        if(newdata.results[0].components.city == undefined){
            cityName.innerHTML=searchBox.value[0].toUpperCase()+searchBox.value.slice(1)+","+newdata.results[0].components.country; 
        }
        if(newdata.results[0].components.country == undefined){
            cityName.innerHTML=searchBox.value[0].toUpperCase()+searchBox.value.slice(1); 
        }
        updateWeatherByLocation(newdata.results[0].geometry.lat,newdata.results[0].geometry.lng);

        const localDateTime = luxon.DateTime.fromMillis((newdata.timestamp.created_unix + newdata.results[0].annotations.timezone.offset_sec) * 1000).setZone(newdata.results[0].annotations.timezone.offset_sec / 3600); // Convert the time to the local time zone
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

    }
    catch (error) {
        console.error('Error updating weather by location:', error);
    }
}


async function getWeatherForCurrentLocation() {
    try {
        const deviceLocation = await getDeviceLocation();
        cityUpdate(deviceLocation.lat, deviceLocation.lon);
    } catch (error) {
        console.error('Error getting device location:', error);
    }
}

// Event listener for the button


// lets create a async function
async function getWeather(city){
                try{
                            // fetch the data from open weather map API
                        let response = await fetch(apiUrl+city+"&key="+apiKey);
                            //now we have to store a the json data into a variable
                        var data=await response.json();
                        cityUpdateforsearch(data.results[0].geometry.lat,data.results[0].geometry.lng);
                        
                        // updateWeatherByLocation(data.results[0].geometry.lat,data.results[0].geometry.lng);
                        // cityName.innerHTML=data.results[0].components.city+","+data.results[0].components.country; 
                        //putting the data from the api into the HTML
                    //     temp.innerHTML=Math.round(data.main.temp)+"&degC";
                    //     condition.innerHTML=data.weather[0].main;
                    //     humid.innerHTML=data.main.humidity+"%";
                    //     windSpeed.innerHTML=data.wind.speed+"km/h";
                    //     max.innerHTML=data.main.temp_max+"&degC";
                    //     min.innerHTML=data.main.temp_min+"&degC";
                    //     air.innerHTML=airquality;
                    //     if(data.sys.country == undefined){
                    //         cityName.innerHTML=data.name ;
                    //     }
                    //     else{
                    //         cityName.innerHTML=data.name +","+data.sys.country; 
                    //     }


                    //     //Conditions for Air quality check start
                    //     if(airquality==1){
                    //         airType.innerHTML="Good";
                    //     }
                    //     else if(airquality==2){
                    //         airType.innerHTML="Fair";
                    //     }
                    //     else if(airquality==3){
                    //         airType.innerHTML="Moderate";
                    //     }
                    //     else if(airquality==4){
                    //         airType.innerHTML="Poor";
                    //     }
                    //     else if(airquality==5){
                    //         airType.innerHTML="Very Poor";
                    //     }
                    //     //Conditions for Air quality check ends

                    //     //Conditions for weather coditions check start
                    //     if(data.weather[0].main == "Clouds"){
                    //             weatherIcon.src="images/clouds.png";
                    //     }
                    //     else if(data.weather[0].main == "Clear"){
                    //             weatherIcon.src="images/clear.png";
                    //     }
                    //     else if(data.weather[0].main == "Rain"){
                    //             weatherIcon.src="images/rain.png";
                    //     }
                    //     else if(data.weather[0].main == "Drizzle"){
                    //             weatherIcon.src="images/drizzle.png";
                    //     }
                    //     else if(data.weather[0].main == "Mist"){
                    //             weatherIcon.src="images/mist.png";
                    //     }
                    //     else if(data.weather[0].main == "Snow"){
                    //             weatherIcon.src="images/snow.png";
                    //     }
                    //     //Conditions for weather coditions check ends
                        
                    //     //DAte and time update start
                       
                    //     const localDateTime = luxon.DateTime.fromMillis((data.dt + data.timezone) * 1000).setZone(data.timezone / 3600); // Convert the time to the local time zone
                    //     const formattedDate = localDateTime.toLocaleString({
                    //         weekday: 'long',
                    //         day: 'numeric',
                    //         month: 'long',  
                    //     });
                    //     const formattedTime = localDateTime.toLocaleString({
                    //         hour: 'numeric',
                    //         minute: 'numeric',
                    //         hour12: true,
                    //     });
                    //         // Update date and time elements
                    //         dayElement.innerHTML = formattedDate.split(',')[0];
                    //         dateElement.innerHTML = formattedDate.split(',')[1];
                    //         timeElement.innerHTML = formattedTime.split(',')[0]; 
 
                    //     //DAte and time update end
                     }
                    catch(error){
                         console.error('Error getting device location:', error);
                    }
            }
//creating the function to update the weather in the browser
async function updateWeather(city) {
    // Fetch weather data for the entered city
    await getWeather(city);
    localStorage.setItem("lastEnteredCity", city);
    // You can also add additional functionality here to update other parts of the UI
}


//This function is to stored the last entered data locally for the browser to update that
async function loadLastEnteredCity() {
    // const lastEnteredCity = localStorage.getItem("lastEnteredCity");
    // if (lastEnteredCity) {
    //     updateWeather(lastEnteredCity);
    // }
    const lastEnteredCity = localStorage.getItem("lastEnteredCity");
    
    if (lastEnteredCity) {
        updateWeather(lastEnteredCity);
    } else {
        try {
            const deviceLocation = await getDeviceLocation();
            cityUpdate(deviceLocation.lat, deviceLocation.lon); // Use cityUpdate instead of updateWeatherByLocation
        } catch (error) {
            console.error('Error getting device location:', error);
        }
    }

}

//Updating the Background Color on basis of time
function updateBackgroundColor() {
    const now = new Date();
    const localTime = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000); // Introducing a harmonious offset
    const hours = localTime.getHours();
    
    let backgroundColor;
//background: linear-gradient(135deg,#87ceeb , #ffff00);
//2  background: linear-gradient(135deg, #ffd966, #00feba);
//3 background: linear-gradient(135deg, #e6b800, #009c8b);
//4 light -background: linear-gradient(135deg, #f0d88e, #00b89c);
//5 noon to night - background: linear-gradient(to top, #ffa07a, #2e2e2e);
    if(hours >= 4 && hours < 6){
    //Morning
    backgroundColor = 'linear-gradient(to top, #00feba, #2e2e2e)';
    }
    else if (hours >= 6 && hours <= 12) {
        // Daytime color
        backgroundColor = 'linear-gradient(to top, #5b548a,#00feba )';
    } 
    else if(hours >12 && hours < 15 ){
        //afternoon
        backgroundColor='linear-gradient(to top, #00feba,#ffd966)';
    }
    else if (hours >= 15 && hours < 17) {
        // Noon
        backgroundColor = 'linear-gradient(to top, #ff6f69, #ffca3a)';
    } else if(hours >=17 && hours <= 18) {
        // Evening
        backgroundColor = 'linear-gradient(to top, #ffa07a, #2e2e2e)';
    }
    else {
        //Night
        backgroundColor = 'linear-gradient(to top, #020111, #000000)';
    }
    
    
    document.querySelector('.card').style.background = backgroundColor;
}
function clearLocalStorage() {
    localStorage.clear();
}

// Attach the clearLocalStorage function to the beforeunload event
window.addEventListener('beforeunload', clearLocalStorage);


currentBtn.addEventListener("click", getWeatherForCurrentLocation);
//taking the input from the search bar and putting it into the api url
searchbtn.addEventListener("click",()=>{
    const enteredCity = searchBox.value;
    updateWeather(enteredCity);
    // searchBox.value="";
});
currentBtn.addEventListener("click", async () => {
    try {
        await getWeatherForCurrentLocation();
        searchBox.value = "";  // Clear the search bar
        reset.style.display = "none";  // Hide the reset button
    } catch (error) {
        console.error('Error getting weather for current location:', error);
    }
});
searchBox.addEventListener("input", () => {
    const enteredText = searchBox.value.trim(); // Trim removes leading and trailing spaces
    reset.style.display = enteredText.length > 0 ? "block" : "none"; //This is for hiding and showing the reset button
});
//submitting the input by clicking enter on the keyboard
searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const enteredCity = searchBox.value;
        updateWeather(enteredCity);
        // searchBox.value="";
    }
});

reset.addEventListener("click",()=>{
      searchBox.value="";
      reset.style.display = "none";
});


updateBackgroundColor();
loadLastEnteredCity();

