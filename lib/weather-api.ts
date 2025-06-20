import { WEATHER_API_BASE_URL } from './api-config';

interface WeatherData {
  temperature: number
  humidity: number
  cloudCover: number
  visibility: number
  conditions: string
}

export async function getWeatherData(lat: number, lng: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE_URL}/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,cloud_cover,visibility,weather_code&temperature_unit=fahrenheit`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    const current = data.current;

    // Convert weather code to conditions string
    // Based on WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    const weatherCode = current.weather_code;
    let conditions = "Clear sky";
    
    if (weatherCode <= 3) conditions = "Clear to partly cloudy";
    else if (weatherCode <= 48) conditions = "Foggy";
    else if (weatherCode <= 57) conditions = "Drizzle";
    else if (weatherCode <= 67) conditions = "Rainy";
    else if (weatherCode <= 77) conditions = "Snow";
    else if (weatherCode <= 82) conditions = "Rain showers";
    else if (weatherCode <= 86) conditions = "Snow showers";
    else if (weatherCode <= 99) conditions = "Thunderstorm";

    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      cloudCover: current.cloud_cover,
      visibility: Math.round(current.visibility / 1609.34 * 10) / 10, // Convert meters to miles
      conditions
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

