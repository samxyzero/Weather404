"use client";

import { useState, useEffect } from "react";
import { Droplets, Wind, Eye, Thermometer, Cloud, Gauge } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { TForecastData, TLocation } from "~/interface/interface.index";
import { getForecast } from "~/lib/weather.api";
import WeatherIcon from "./ui/weatherIcon";
import { Button } from "./ui/button";

interface THourlyWeatherData {
  time: string;
  timeEpoch: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  iconType: "sunny" | "partly-cloudy" | "cloudy" | "rainy";
  humidity: number;
  windSpeed: number;
  windDir: string;
  chanceOfRain: number;
  visibility: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
}

interface HourlyWeatherProps {
  location: TLocation;
  unit: "imperial" | "metric";
  hoursToShow?: number;
  showDetails?: boolean;
}

export default function HourlyWeather({
  location,
  unit,
  hoursToShow = 24,
  showDetails = true,
}: HourlyWeatherProps) {
  const [forecastData, setForecastData] = useState<TForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailShown, setShowDetails] = useState(showDetails);

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Get forecast for today and tomorrow to ensure we have enough hours
        const data = await getForecast(location, 2, { aqi: true });
        setForecastData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch hourly weather data",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchHourlyData();
  }, [location]);

  const getWeatherIconType = (
    condition: string,
  ): "sunny" | "partly-cloudy" | "cloudy" | "rainy" => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sunny") || conditionLower.includes("clear"))
      return "sunny";
    if (conditionLower.includes("partly") || conditionLower.includes("partial"))
      return "partly-cloudy";
    if (
      conditionLower.includes("rain") ||
      conditionLower.includes("shower") ||
      conditionLower.includes("drizzle")
    )
      return "rainy";
    return "cloudy";
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  const isCurrentHour = (timeEpoch: number): boolean => {
    const now = new Date();
    const hourTime = new Date(timeEpoch * 1000);
    return (
      now.getHours() === hourTime.getHours() &&
      now.getDate() === hourTime.getDate()
    );
  };

  const getHourlyData = (): THourlyWeatherData[] => {
    if (!forecastData) return [];

    const allHours: THourlyWeatherData[] = [];

    // Combine hours from all forecast days
    forecastData.forecast.forecastday.forEach((day) => {
      day.hour.forEach((hour) => {
        allHours.push({
          time: formatTime(hour.time),
          timeEpoch: hour.time_epoch,
          temperature: unit === "imperial" ? hour.temp_f : hour.temp_c,
          feelsLike: unit === "imperial" ? hour.feelslike_f : hour.feelslike_c,
          condition: hour.condition.text,
          iconType: getWeatherIconType(hour.condition.text),
          humidity: hour.humidity,
          windSpeed: unit === "imperial" ? hour.wind_mph : hour.wind_kph,
          windDir: hour.wind_dir,
          chanceOfRain: hour.chance_of_rain,
          visibility: unit === "imperial" ? hour.vis_miles : hour.vis_km,
          pressure: unit === "imperial" ? hour.pressure_in : hour.pressure_mb,
          cloudCover: hour.cloud,
          uvIndex: hour.uv,
        });
      });
    });

    // Filter to show only future hours and limit
    const now = Date.now() / 1000;
    return allHours
      .filter((hour) => hour.timeEpoch >= now)
      .slice(0, hoursToShow);
  };

  const getDetailedStats = (hour: THourlyWeatherData) => [
    {
      icon: Wind,
      label: "Wind",
      value: `${Math.round(hour.windSpeed)} ${unit === "imperial" ? "mph" : "km/h"}`,
      subValue: hour.windDir,
    },
    {
      icon: Droplets,
      label: "Rain",
      value: `${hour.chanceOfRain}%`,
    },
    {
      icon: Cloud,
      label: "Humidity",
      value: `${hour.humidity}%`,
    },
    {
      icon: Eye,
      label: "Visibility",
      value: `${hour.visibility} ${unit === "imperial" ? "mi" : "km"}`,
    },
    {
      icon: Gauge,
      label: "Pressure",
      value: `${hour.pressure} ${unit === "imperial" ? "in" : "mb"}`,
    },
    {
      icon: Thermometer,
      label: "UV",
      value: `${hour.uvIndex}`,
    },
  ];

  if (loading) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-xl text-white">Loading hourly forecast...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-xl text-red-300">Error: {error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hourlyData = getHourlyData();

  if (hourlyData.length === 0) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-xl text-white">No hourly data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
      <CardContent className="p-6">
        <h3 className="mb-6 flex items-center justify-between text-xl font-semibold text-white">
          Hourly Forecast ({hourlyData.length} hours)
          <Button
            variant={"ghost"}
            className="text-white/70 transition-colors hover:text-white"
            onClick={() => setShowDetails(!isDetailShown)}
          >
            {isDetailShown ? "Hide Details" : "Show Details"}
          </Button>
        </h3>

        <div className="overflow-x-auto">
          <div
            className="flex gap-4 pb-4"
            style={{ minWidth: `${hourlyData.length * 200}px` }}
          >
            {hourlyData.map((hour, index) => (
              <div
                key={index}
                className={`w-48 flex-shrink-0 border-white/20 bg-white/10 p-4 backdrop-blur-md ${
                  isCurrentHour(hour.timeEpoch) ? "ring-2 ring-white/50" : ""
                }`}
              >
                <div className="mb-3 text-center">
                  <p className="font-medium text-white/90">
                    {index === 0 ? "Now" : hour.time}
                  </p>
                  {isCurrentHour(hour.timeEpoch) && (
                    <p className="text-xs text-white/70">Current</p>
                  )}
                </div>

                <div className="mb-3 flex justify-center">
                  <WeatherIcon type={hour.iconType} size={48} />
                </div>

                <div className="mb-3 text-center">
                  <p className="text-2xl font-bold text-white">
                    {Math.round(hour.temperature)}°
                  </p>
                  <p className="text-sm text-white/70">
                    Feels {Math.round(hour.feelsLike)}°
                  </p>
                </div>

                <div className="mb-4 text-center">
                  <p className="text-sm text-white/80">{hour.condition}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Droplets className="text-blue-300" size={14} />
                      <span className="text-xs text-white/70">Rain</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {hour.chanceOfRain}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Wind className="text-gray-300" size={14} />
                      <span className="text-xs text-white/70">Wind</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {Math.round(hour.windSpeed)}{" "}
                      {unit === "imperial" ? "mph" : "km/h"}
                    </span>
                  </div>
                </div>

                {/* Detailed Stats (if enabled) */}
                {isDetailShown && (
                  <div className="mt-4 border-t border-white/20 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {getDetailedStats(hour)
                        .slice(2)
                        .map((stat, statIndex) => {
                          const IconComponent = stat.icon;
                          return (
                            <div key={statIndex} className="text-center">
                              <IconComponent
                                className="mx-auto mb-1 text-white/60"
                                size={12}
                              />
                              <p className="text-white/60">{stat.label}</p>
                              <p className="font-medium text-white">
                                {stat.value}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 border-t border-white/20 pt-4">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <p className="text-sm text-white/70">Avg Temp</p>
              <p className="text-lg font-semibold text-white">
                {Math.round(
                  hourlyData.reduce((sum, h) => sum + h.temperature, 0) /
                    hourlyData.length,
                )}
                °
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Max Rain</p>
              <p className="text-lg font-semibold text-white">
                {Math.max(...hourlyData.map((h) => h.chanceOfRain))}%
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Avg Wind</p>
              <p className="text-lg font-semibold text-white">
                {Math.round(
                  hourlyData.reduce((sum, h) => sum + h.windSpeed, 0) /
                    hourlyData.length,
                )}{" "}
                {unit === "imperial" ? "mph" : "km/h"}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70">Avg Humidity</p>
              <p className="text-lg font-semibold text-white">
                {Math.round(
                  hourlyData.reduce((sum, h) => sum + h.humidity, 0) /
                    hourlyData.length,
                )}
                %
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
