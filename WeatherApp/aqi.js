const apiKey = 'd083da09899df1f8443ae99047b1d7fc';
const apiUrl = 'http://api.openweathermap.org/data/2.5/air_pollution?';

export async function getAirQuality(lat,long) {
  try {
    const response = await fetch(`${apiUrl}lat=${lat}&lon=${long}&appid=${apiKey}`);
    const data = await response.json();

    if (response.ok) {
      // Extract the air quality index from the API response
      const airQualityIndex = data.list[0].main.aqi;

      return airQualityIndex;
    } else {
      // Handle API error
      console.error('Error fetching air quality:');
      return null;
    }
  } catch (error) {
    // Handle network error
    console.error('Network error:');
    return null;
  }
}

