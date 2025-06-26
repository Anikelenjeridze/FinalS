
import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { WeatherData, getWeatherForecast } from '../services/weatherService';

interface WeatherWidgetProps {
  location: string;
  date: string;
  isOutdoor: boolean;
}

export const WeatherWidget = ({ location, date, isOutdoor }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOutdoor) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const forecast = await getWeatherForecast(location, date);
        if (forecast) {
          setWeather(forecast.current);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, date, isOutdoor]);

  if (!isOutdoor) return null;

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
        <div className="flex items-center space-x-2">
          <Cloud className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className="text-sm text-blue-700">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-lg p-3 mt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{weather.icon}</span>
          <div>
            <p className="text-sm font-medium text-blue-800">
              {weather.description}
            </p>
            <p className="text-xs text-blue-600">Weather forecast</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-xs text-blue-700">
          <div className="flex items-center space-x-1">
            <Thermometer className="h-3 w-3" />
            <span>{weather.temperature}°C</span>
          </div>
          <div className="flex items-center space-x-1">
            <Droplets className="h-3 w-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="h-3 w-3" />
            <span>{weather.windSpeed}km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
