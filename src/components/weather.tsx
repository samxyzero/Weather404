"use client";
import { useState, useEffect } from 'react';
import { Droplets, Eye, MapPin, Wind, Gauge, Cloud, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';

import type { TCurrentWeatherData } from '~/interface/interface.index';
import { getCurrentWeather } from '~/lib/weather.api';
import WeatherIcon from './ui/weatherIcon';


interface WeatherStats {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
  subValue?: string;
}

interface WeatherComponentProps {
  location?: string; 
  unit: 'imperial' | 'metric';
}

export default function Weather({ location = 'Pokhara', unit  }: WeatherComponentProps) {
  const [weatherData, setWeatherData] = useState<TCurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentWeather(location, { aqi: true });
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

     void fetchWeatherData();
  }, [location]);

  const getWeatherIconType = (condition: string): "sunny" | "partly-cloudy" | "cloudy" | "rainy" => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return 'sunny';
    if (conditionLower.includes('partly') || conditionLower.includes('partial')) return 'partly-cloudy';
    if (conditionLower.includes('rain') || conditionLower.includes('shower')) return 'rainy';
    return 'cloudy';
  };



  const getDetailedWeatherStats = (): WeatherStats[] => {
    if (!weatherData) return [];

    return [
      {
        icon: Wind,
        label: 'Wind',
        value: `${unit === 'imperial' ? weatherData.current.wind_mph : weatherData.current.wind_kph} ${unit === 'imperial' ? 'mph' : 'km/h'}`,
        subValue: weatherData.current.wind_dir
      },
      {
        icon: Droplets,
        label: 'Humidity',
        value: `${weatherData.current.humidity}%`
      },
      {
        icon: Eye,
        label: 'Visibility',
        value: `${unit === 'imperial' ? weatherData.current.vis_miles : weatherData.current.vis_km} ${unit === 'imperial' ? 'mi' : 'km'}`
      },
      {
        icon: Gauge,
        label: 'Pressure',
        value: `${unit === 'imperial' ? weatherData.current.pressure_in : weatherData.current.pressure_mb} ${unit === 'imperial' ? 'in' : 'mb'}`
      },
      {
        icon: Zap,
        label: 'UV Index',
        value: `${weatherData.current.uv}`
      },
      {
        icon: Cloud,
        label: 'Cloud Cover',
        value: `${weatherData.current.cloud}%`
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">Loading weather data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-300 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">No weather data available</div>
      </div>
    );
  }

  const temperature = unit === 'imperial' ? weatherData.current.temp_f : weatherData.current.temp_c;
  const feelsLike = unit === 'imperial' ? weatherData.current.feelslike_f : weatherData.current.feelslike_c;

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card className="flexa backdrop-blur-md bg-white/20 border-white/30 shadow-xl">
        <CardContent className="text-center w-full p-6">
          <div className="flex items-center justify-center mb-3">
            <MapPin className="text-white/80 mr-3" size={20} />
            <p className="text-white/90 font-medium text-xl">{weatherData.location.name}</p>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <WeatherIcon type={getWeatherIconType(weatherData.current.condition.text)} size={120} />
          </div>
          
          <div>
            <h1 className="text-8xl font-bold text-white mb-4">{Math.round(temperature)}°</h1>
            <p className="text-white/90 text-3xl mb-2">{weatherData.current.condition.text}</p>
            <p className="text-white/70 text-xl">Feels like {Math.round(feelsLike)}°</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
            {getDetailedWeatherStats().map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="backdrop-blur-md bg-white/10 border-white/20 p-4 text-center rounded-lg">
                  <IconComponent className="text-white/80 mx-auto mb-2" size={24} />
                  <p className="text-white text-sm opacity-80">{stat.label}</p>
                  <p className="text-white text-lg font-semibold">{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-white/70 text-xs">{stat.subValue}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

 
    </div>
  );
}