"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Droplets,
  Wind,
  Eye,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

import type { TForecastData, TLocation } from "~/interface/interface.index";
import { getForecast } from "~/lib/weather.api";
import WeatherIcon from "./ui/weatherIcon";

interface ForecastComponentProps {
  location: TLocation;
  unit: "imperial" | "metric";
}

interface DayForecast {
  date: string;
  dayName: string;
  condition: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  visibility: number;
  chanceOfRain: number;
  sunrise: string;
  sunset: string;
}

export default function SevenDayForecast({
  location,
  unit,
}: ForecastComponentProps) {
  const [forecastData, setForecastData] = useState<TForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getForecast(location, 7, {
          aqi: false,
          alerts: false,
        });
        setForecastData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch forecast data",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchForecastData();
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

  const formatDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const processForecastData = (): DayForecast[] => {
    if (!forecastData) return [];

    return forecastData.forecast.forecastday.map((day) => ({
      date: day.date,
      dayName: formatDayName(day.date),
      condition: day.day.condition.text,
      icon: day.day.condition.icon,
      maxTemp: unit === "imperial" ? day.day.maxtemp_f : day.day.maxtemp_c,
      minTemp: unit === "imperial" ? day.day.mintemp_f : day.day.mintemp_c,
      humidity: day.day.avghumidity,
      windSpeed:
        unit === "imperial" ? day.day.maxwind_mph : day.day.maxwind_kph,
      windDir: day.day.condition.text,
      visibility:
        unit === "imperial" ? day.day.avgvis_miles : day.day.avgvis_km,
      chanceOfRain: day.day.daily_chance_of_rain,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
    }));
  };

  if (loading) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-xl text-white">Loading 7-day forecast...</div>
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

  if (!forecastData) {
    return (
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-xl text-white">No forecast data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const forecast = processForecastData();

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center">
            <MapPin className="mr-3 text-white/80" size={20} />
            <h2 className="text-2xl font-medium text-white/90">
              {forecastData.location.name}
            </h2>
          </div>
          <h1 className="text-center text-3xl font-bold text-white">
            7-Day Weather Forecast
          </h1>
        </CardContent>
      </Card>

      {/* Forecast Cards */}
      <div className="grid gap-4">
        {forecast.map((day, index) => (
          <Card
            key={day.date}
            className={`border-white/30 shadow-xl backdrop-blur-md transition-all hover:scale-[1.02] ${
              index === 0
                ? "border-white/50 bg-white/30" // Today - more prominent
                : "bg-white/20"
            }`}
          >
            <CardContent className="p-6">
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-6">
                {/* Date and Day */}
                <div className="text-center md:text-left">
                  <h3
                    className={`font-bold ${index === 0 ? "text-xl text-white" : "text-lg text-white/90"}`}
                  >
                    {day.dayName}
                  </h3>
                  <p className="text-sm text-white/70">
                    {formatDate(day.date)}
                  </p>
                </div>

                {/* Weather Icon and Condition */}
                <div className="flex flex-col items-center">
                  <WeatherIcon
                    type={getWeatherIconType(day.condition)}
                    size={60}
                  />
                  <p className="mt-2 text-center text-sm text-white/90">
                    {day.condition}
                  </p>
                </div>

                {/* Temperature */}
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowUp className="text-red-400" size={16} />
                    <span className="text-xl font-bold text-white">
                      {Math.round(day.maxTemp)}°
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-center space-x-2">
                    <ArrowDown className="text-blue-400" size={16} />
                    <span className="text-lg text-white/80">
                      {Math.round(day.minTemp)}°
                    </span>
                  </div>
                </div>

                {/* Weather Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Droplets className="text-blue-400" size={16} />
                    <div>
                      <p className="text-xs text-white/70">Rain</p>
                      <p className="text-sm font-semibold text-white">
                        {day.chanceOfRain}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="text-white/70" size={16} />
                    <div>
                      <p className="text-xs text-white/70">Humidity</p>
                      <p className="text-sm font-semibold text-white">
                        {day.humidity}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Wind className="text-white/70" size={16} />
                    <div>
                      <p className="text-xs text-white/70">Wind</p>
                      <p className="text-sm font-semibold text-white">
                        {Math.round(day.windSpeed)}{" "}
                        {unit === "imperial" ? "mph" : "km/h"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="text-white/70" size={16} />
                    <div>
                      <p className="text-xs text-white/70">Visibility</p>
                      <p className="text-sm font-semibold text-white">
                        {Math.round(day.visibility)}{" "}
                        {unit === "imperial" ? "mi" : "km"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sun Times */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Sun className="text-yellow-400" size={16} />
                    <div>
                      <p className="text-xs text-white/70">Sunrise</p>
                      <p className="text-sm font-semibold text-white">
                        {day.sunrise}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Moon className="text-orange-400" size={16} />
                    <div>
                      <p className="text-xs text-white/70">Sunset</p>
                      <p className="text-sm font-semibold text-white">
                        {day.sunset}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="border-white/30 bg-white/20 shadow-xl backdrop-blur-md">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold text-white">7-Day Summary</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-sm text-white/70">Avg High</p>
              <p className="text-xl font-bold text-white">
                {Math.round(
                  forecast.reduce((sum, day) => sum + day.maxTemp, 0) /
                    forecast.length,
                )}
                °
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/70">Avg Low</p>
              <p className="text-xl font-bold text-white">
                {Math.round(
                  forecast.reduce((sum, day) => sum + day.minTemp, 0) /
                    forecast.length,
                )}
                °
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/70">Rainy Days</p>
              <p className="text-xl font-bold text-white">
                {forecast.filter((day) => day.chanceOfRain > 50).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/70">Avg Humidity</p>
              <p className="text-xl font-bold text-white">
                {Math.round(
                  forecast.reduce((sum, day) => sum + day.humidity, 0) /
                    forecast.length,
                )}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
