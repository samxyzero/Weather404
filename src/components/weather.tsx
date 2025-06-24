"use client";
import { useState, useEffect } from "react";
import { Droplets, Eye, MapPin, Wind, Gauge, Cloud, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";

import type {
  TCurrentWeatherData,
  TLocation,
} from "~/interface/interface.index";
import { getCurrentWeather } from "~/lib/weather.api";
import WeatherIcon from "./ui/weatherIcon";

interface WeatherStats {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
  subValue?: string;
}

interface WeatherComponentProps {
  location: TLocation;
  unit: "imperial" | "metric";
}

export default function Weather({ location, unit }: WeatherComponentProps) {
  const [weatherData, setWeatherData] = useState<TCurrentWeatherData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!location) {
          throw new Error("Location is required to fetch weather data");
        }
        const data = await getCurrentWeather(location, { aqi: true });
        setWeatherData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch weather data",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchWeatherData();
  }, [location]);

  const getWeatherIconType = (
    condition: string,
  ): "sunny" | "partly-cloudy" | "cloudy" | "rainy" => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sunny") || conditionLower.includes("clear"))
      return "sunny";
    if (conditionLower.includes("partly") || conditionLower.includes("partial"))
      return "partly-cloudy";
    if (conditionLower.includes("rain") || conditionLower.includes("shower"))
      return "rainy";
    return "cloudy";
  };

  const getDetailedWeatherStats = (): WeatherStats[] => {
    if (!weatherData) return [];

    return [
      {
        icon: Wind,
        label: "Wind",
        value: `${unit === "imperial" ? weatherData.current.wind_mph : weatherData.current.wind_kph} ${unit === "imperial" ? "mph" : "km/h"}`,
        subValue: weatherData.current.wind_dir,
      },
      {
        icon: Droplets,
        label: "Humidity",
        value: `${weatherData.current.humidity}%`,
      },
      {
        icon: Eye,
        label: "Visibility",
        value: `${unit === "imperial" ? weatherData.current.vis_miles : weatherData.current.vis_km} ${unit === "imperial" ? "mi" : "km"}`,
      },
      {
        icon: Gauge,
        label: "Pressure",
        value: `${unit === "imperial" ? weatherData.current.pressure_in : weatherData.current.pressure_mb} ${unit === "imperial" ? "in" : "mb"}`,
      },
      {
        icon: Zap,
        label: "UV Index",
        value: `${weatherData.current.uv}`,
      },
      {
        icon: Cloud,
        label: "Cloud Cover",
        value: `${weatherData.current.cloud}%`,
      },
    ];
  };

  if (loading) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-xl text-white">Loading weather data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-xl text-red-300">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-xl text-white">No weather data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const temperature =
    unit === "imperial"
      ? weatherData.current.temp_f
      : weatherData.current.temp_c;
  const feelsLike =
    unit === "imperial"
      ? weatherData.current.feelslike_f
      : weatherData.current.feelslike_c;

  return (
    <div className="space-y-6">
      {/* Main Weather Card */}
      <Card className="flex border-white/30 bg-white/20 shadow-xl">
        <CardContent className="w-full p-6 text-center">
          <div className="mb-3 flex items-center justify-center">
            <MapPin className="mr-3 text-white/80" size={20} />
            <p className="text-xl font-medium text-white/90">
              {weatherData.location.name}
            </p>
          </div>

          <div className="mb-4 flex items-center justify-center">
            <WeatherIcon
              type={getWeatherIconType(weatherData.current.condition.text)}
              size={120}
            />
          </div>

          <div>
            <h1 className="mb-4 text-8xl font-bold text-white">
              {Math.round(temperature)}°
            </h1>
            <p className="mb-2 text-3xl text-white/90">
              {weatherData.current.condition.text}
            </p>
            <p className="text-xl text-white/70">
              Feels like {Math.round(feelsLike)}°
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-6">
            {getDetailedWeatherStats().map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="border-white/20 bg-white/10 p-4 text-center backdrop-blur-md"
                >
                  <IconComponent
                    className="mx-auto mb-2 text-white/80"
                    size={24}
                  />
                  <p className="text-sm text-white opacity-80">{stat.label}</p>
                  <p className="text-lg font-semibold text-white">
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-xs text-white/70">{stat.subValue}</p>
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
