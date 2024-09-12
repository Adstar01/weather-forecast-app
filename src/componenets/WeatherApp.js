import React, { useState, useEffect } from 'react';
import { MapPin, Droplet, Wind } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Alert, AlertTitle, AlertDescription } from './ui/Alert';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => fetchWeatherData(position.coords.latitude, position.coords.longitude),
      () => setError("Unable to retrieve your location. Please enable location services.")
    );
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`);
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }

      const data = await response.json();

      setWeather(data.current_weather);
      setForecast(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      setLoading(false);
    }
  };

  const getWeatherDescription = (code) => {
    // This is a simplified version. You might want to expand this based on Open-Meteo's weather codes
    if (code <= 3) return "Clear";
    if (code <= 48) return "Cloudy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    return "Stormy";
  };

  const formatForecastData = () => {
    return forecast.hourly.time.slice(0, 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(forecast.hourly.temperature_2m[index])
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading weather data...</div>;
  if (error) return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  if (!weather || !forecast) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Local Weather</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{Math.round(weather.temperature)}°C</p>
              <p className="text-xl capitalize">{getWeatherDescription(weather.weathercode)}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Droplet className="mr-2" />
              <span>Humidity: {forecast.hourly.relativehumidity_2m[0]}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="mr-2" />
              <span>Wind: {Math.round(weather.windspeed)} km/h</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Hourly Forecast</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={formatForecastData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">7-Day Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {forecast.daily.time.map((day, index) => (
            <div key={index} className="text-center">
              <p className="font-semibold">{new Date(day).toLocaleDateString([], { weekday: 'short' })}</p>
              <p className="text-sm">{getWeatherDescription(forecast.daily.weathercode[index])}</p>
              <p>{Math.round(forecast.daily.temperature_2m_max[index])}°C</p>
              <p className="text-sm text-gray-500">{Math.round(forecast.daily.temperature_2m_min[index])}°C</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Weather Map</h2>
        <p className="text-sm text-gray-600 mb-2">For an interactive weather map, please visit <a href="https://www.windy.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Windy.com</a>.</p>
      </div>
    </div>
  );
};

export default WeatherApp;