import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';  // Adjust the path based on your project structure

const Weather = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]); // New state for hourly forecast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=07dda3d5320502411e2804ee49db0187`
      );

      if (!response.ok) {
        throw new Error('Weather data could not be fetched');
      }

      const data = await response.json();

      // Filter hourly forecast for the selected date
      const selectedDate = new Date(date);
      const hourlyData = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt);
        return forecastDate.toDateString() === selectedDate.toDateString();
      });

      setWeatherData(hourlyData[0] || null); // Set the first forecast (main)
      setHourlyForecast(hourlyData); // Set all hourly data for the selected date
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (location && date) {
      fetchWeatherData();
    } else {
      setError('Please enter both location and date.');
    }
  };

  const getWeatherImage = (description) => {
    if (description.includes('clear')) return assets.clear;
    if (description.includes('clouds')) return assets.clouds;
    if (description.includes('drizzle')) return assets.drizzle;
    if (description.includes('rain')) return assets.rain;
    if (description.includes('mist')) return assets.mist;
    if (description.includes('wind')) return assets.wind;
    if (description.includes('snow')) return assets.snow;
    return assets.clear;
  };

  const getBackgroundColor = (description) => {
    if (description.includes('clear')) return '#87CEEB'; // light blue
    if (description.includes('clouds')) return '#B0C4DE'; // light steel blue
    if (description.includes('rain') || description.includes('drizzle')) return '#778899'; // slate gray
    if (description.includes('mist') || description.includes('fog')) return '#C0C0C0'; // silver
    if (description.includes('snow')) return '#F0F8FF'; // alice blue
    return '#FFFFFF'; // default white
  };

  return (
    <div className="text-center p-4 font-sans">
      <h3 className="text-2xl mb-8">Weather Forecast</h3>

      <div className="mb-8 flex justify-center gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-3 w-full max-w-xs text-base border rounded-lg border-gray-300"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-3 w-90 max-w-xs text-base border rounded-lg border-gray-300"
        />
        <button
          onClick={handleSearch}
          className="p-3 w-50 max-w-xs bg-primary text-white rounded-lg border-none cursor-pointer"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading weather...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weatherData && (
        <div
          className="inline-block text-center p-8 rounded-xl"
          style={{
            backgroundColor: getBackgroundColor(weatherData.weather[0].description),
          }}
        >
          <img
            src={getWeatherImage(weatherData.weather[0].description)}
            alt="Weather Icon"
            className="w-36 h-36 mx-auto"
          />
          <h4 className="mt-6 text-xl capitalize">
            {weatherData.weather[0].description}
          </h4>

          <h4 className="mt-6">Weather Forecast for {location} on {new Date(date).toLocaleDateString()}:</h4>

          <div className="flex justify-around mt-6 gap-4 flex-wrap">
            <div className="border p-4 rounded-xl w-32 text-center">
              <img
                src={assets.humidity}
                alt="Humidity Icon"
                className="w-8 mx-auto"
              />
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>

            <div className="border p-4 rounded-xl w-32 text-center">
              <img
                src={assets.thermometer}
                alt="Temperature Icon"
                className="w-8 mx-auto"
              />
              <p>Temperature: {weatherData.main.temp}°C</p>
            </div>

            <div className="border p-4 rounded-xl w-32 text-center">
              <img
                src={assets.windy}
                alt="Wind Speed Icon"
                className="w-8 mx-auto"
              />
              <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            </div>
          </div>
        </div>
      )}

      {hourlyForecast.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-medium mb-4">Hourly Forecast:</h4>
          <div className="flex gap-4 overflow-x-auto p-4">
            {hourlyForecast.map((hourData, index) => (
              <div
                key={index}
                className="border p-4 rounded-xl w-32 text-center flex-shrink-0"
              >
                <p>
                  {new Date(hourData.dt_txt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <img
                  src={getWeatherImage(hourData.weather[0].description)}
                  alt="Weather Icon"
                  className="w-12 h-12 mx-auto"
                />
                <p>{hourData.main.temp}°C</p>
                <p>{hourData.weather[0].description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && !weatherData && (
        <p>No weather data available. Please try another search.</p>
      )}
    </div>
  );
};

export default Weather;
