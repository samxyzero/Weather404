"use client";
import { useState, useEffect } from "react";
import { Sun, Sunrise, Sunset, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";

import type { TAstronomyData } from "~/interface/interface.index";
import { getAstronomy } from "~/lib/weather.api";

interface AstronomyComponentProps {
  location?: string;
}

interface SunMoonStats {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
  subValue?: string;
}

export function SunInfo({ location = "Pokhara" }: AstronomyComponentProps) {
  const [astronomyData, setAstronomyData] = useState<TAstronomyData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstronomyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAstronomy(location);
        setAstronomyData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch astronomy data",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchAstronomyData();
  }, [location]);

  const getCurrentSunPhase = ():
    | "sunrise"
    | "daylight"
    | "sunset"
    | "night" => {
    if (!astronomyData) return "daylight";

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const sunrise = astronomyData.astronomy.astro.sunrise;
    const sunset = astronomyData.astronomy.astro.sunset;

    // Convert 12-hour format to 24-hour for comparison
    const convertTo24Hour = (time: string) => {
      const [timePart, period] = time.split(" ");
      const [hoursRaw, minutesRaw] = (timePart ?? "00:00").split(":");
      let hours = Number(hoursRaw ?? "0");
      const minutes = Number(minutesRaw ?? "0");
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const sunriseTime = convertTo24Hour(sunrise);
    const sunsetTime = convertTo24Hour(sunset);

    if (currentTime >= sunriseTime && currentTime < sunsetTime) {
      const sunriseHour = parseInt(sunriseTime.split(":")[0] ?? "0");
      const currentHour = parseInt(currentTime.split(":")[0] ?? "0");
      if (currentHour - sunriseHour <= 1) return "sunrise";

      const sunsetHour = parseInt(sunsetTime.split(":")[0] ?? "0");
      if (sunsetHour - currentHour <= 1) return "sunset";

      return "daylight";
    }
    return "night";
  };

  const getSunStats = (): SunMoonStats[] => {
    if (!astronomyData) return [];

    const phase = getCurrentSunPhase();
    const phaseLabel =
      phase === "sunrise"
        ? "Sunrise"
        : phase === "sunset"
          ? "Sunset"
          : phase === "daylight"
            ? "Daylight"
            : "Night";

    return [
      {
        icon: Sunrise,
        label: "Sunrise",
        value: astronomyData.astronomy.astro.sunrise,
      },
      {
        icon: Sunset,
        label: "Sunset",
        value: astronomyData.astronomy.astro.sunset,
      },
      {
        icon: Clock,
        label: "Current Phase",
        value: phaseLabel,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-white">Loading sun data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-300">Error: {error}</div>
      </div>
    );
  }

  if (!astronomyData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-white">No sun data available</div>
      </div>
    );
  }

  const currentPhase = getCurrentSunPhase();

  return (
    <Card className="border-yellow-300/30 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 shadow-xl backdrop-blur-md">
      <CardContent className="w-full p-6 text-center">
        <div className="mb-3 flex items-center justify-center">
          <MapPin className="mr-3 text-white/80" size={20} />
          <p className="text-xl font-medium text-white/90">
            {astronomyData.location.name}
          </p>
        </div>

        <div className="mb-4 flex items-center justify-center">
          <Sun className="text-yellow-300" size={80} />
        </div>

        <div>
          <h2 className="mb-2 text-4xl font-bold text-white">
            Sun Information
          </h2>
          <p className="mb-4 text-xl text-white/90">
            Current Phase:{" "}
            {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {getSunStats().map((stat, index) => {
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
                <p className="text-lg font-semibold text-white">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-white/70">{stat.subValue}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function MoonInfo({ location = "Pokhara" }: AstronomyComponentProps) {
  const [astronomyData, setAstronomyData] = useState<TAstronomyData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAstronomyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAstronomy(location);
        setAstronomyData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch astronomy data",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchAstronomyData();
  }, [location]);

  const getMoonPhaseIcon = (phase: string) => {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes("new")) return "🌑";
    if (phaseLower.includes("waxing crescent")) return "🌒";
    if (phaseLower.includes("first quarter")) return "🌓";
    if (phaseLower.includes("waxing gibbous")) return "🌔";
    if (phaseLower.includes("full")) return "🌕";
    if (phaseLower.includes("waning gibbous")) return "🌖";
    if (
      phaseLower.includes("last quarter") ||
      phaseLower.includes("third quarter")
    )
      return "🌗";
    if (phaseLower.includes("waning crescent")) return "🌘";
    return "🌙";
  };

  const getMoonStats = (): SunMoonStats[] => {
    if (!astronomyData) return [];

    return [
      {
        icon: () => (
          <span className="text-2xl">
            {getMoonPhaseIcon(astronomyData.astronomy.astro.moon_phase)}
          </span>
        ),
        label: "Moon Phase",
        value: astronomyData.astronomy.astro.moon_phase,
      },
      {
        icon: () => <span className="text-xl">🌅</span>,
        label: "Moonrise",
        value: astronomyData.astronomy.astro.moonrise,
      },
      {
        icon: () => <span className="text-xl">🌄</span>,
        label: "Moonset",
        value: astronomyData.astronomy.astro.moonset,
      },
      {
        icon: () => <span className="text-xl">💡</span>,
        label: "Illumination",
        value: `${astronomyData.astronomy.astro.moon_illumination}%`,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-white">Loading moon data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-red-300">Error: {error}</div>
      </div>
    );
  }

  if (!astronomyData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-xl text-white">No moon data available</div>
      </div>
    );
  }

  return (
    <Card className="border-blue-300/30 bg-gradient-to-br from-blue-600/20 to-purple-700/20 shadow-xl backdrop-blur-md">
      <CardContent className="w-full p-6 text-center">
        <div className="mb-3 flex items-center justify-center">
          <MapPin className="mr-3 text-white/80" size={20} />
          <p className="text-xl font-medium text-white/90">
            {astronomyData.location.name}
          </p>
        </div>

        <div className="mb-4 flex items-center justify-center">
          <span className="text-8xl">
            {getMoonPhaseIcon(astronomyData.astronomy.astro.moon_phase)}
          </span>
        </div>

        <div>
          <h2 className="mb-2 text-4xl font-bold text-white">
            Moon Information
          </h2>
          <p className="mb-4 text-xl text-white/90">
            {astronomyData.astronomy.astro.moon_phase}
          </p>
          <p className="text-lg text-white/70">
            {astronomyData.astronomy.astro.moon_illumination}% Illuminated
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {getMoonStats().map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="border-white/20 bg-white/10 p-4 text-center backdrop-blur-md"
              >
                <div className="mb-2 flex justify-center">
                  <IconComponent className="text-white/80" size={24} />
                </div>
                <p className="text-sm text-white opacity-80">{stat.label}</p>
                <p className="text-lg font-semibold text-white">{stat.value}</p>
                {stat.subValue && (
                  <p className="text-xs text-white/70">{stat.subValue}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AstronomyInfo({ location }: AstronomyComponentProps) {
  return (
    <div className="space-y-6">
      <SunInfo location={location} />
      <MoonInfo location={location} />
    </div>
  );
}
