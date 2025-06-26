
export interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date: string;
}

export interface WeatherForecast {
  current: WeatherData;
  forecast: WeatherData[];
}

// For demo purposes, we'll use mock weather data
// In production, you'd use a real weather API like OpenWeatherMap
export const getWeatherForecast = async (location: string, date: string): Promise<WeatherForecast | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock weather data based on location and date
    const mockWeatherData: WeatherForecast = {
      current: {
        temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
        description: getRandomWeather(),
        icon: getWeatherIcon(getRandomWeather()),
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
        date: new Date().toISOString()
      },
      forecast: Array.from({ length: 3 }, (_, i) => ({
        temperature: Math.floor(Math.random() * 15) + 15,
        description: getRandomWeather(),
        icon: getWeatherIcon(getRandomWeather()),
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 10) + 5,
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString()
      }))
    };
    
    return mockWeatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const getRandomWeather = (): string => {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

const getWeatherIcon = (condition: string): string => {
  const iconMap: { [key: string]: string } = {
    'Sunny': '☀️',
    'Partly Cloudy': '⛅',
    'Cloudy': '☁️',
    'Light Rain': '🌦️',
    'Clear': '🌤️'
  };
  return iconMap[condition] || '☀️';
};

export const isOutdoorEvent = (location: string, description: string): boolean => {
  const outdoorKeywords = [
    'park', 'garden', 'outdoor', 'beach', 'field', 'playground', 'trail', 
    'street', 'avenue', 'block party', 'festival', 'market', 'picnic'
  ];
  
  const text = `${location} ${description}`.toLowerCase();
  return outdoorKeywords.some(keyword => text.includes(keyword));
};
