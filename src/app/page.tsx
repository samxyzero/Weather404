"use client";
import HourlyWeather from "~/components/hourly.Weather";
import Weather from "~/components/weather";
import { MapPin, Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { GetLocation } from "~/lib/location";
import AstronomyInfo from "~/components/astronomy";
import SevenDayForecast from "~/components/forecast";
import cities from "cities-list";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string>(
    GetLocation() ?? "Paris",
  );
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim().toLowerCase();
    // Find a matching city key in a case-insensitive way
    const matchedCity = Object.keys(cities).find(
      (city) => city.toLowerCase() === trimmedQuery,
    );
    if (!!trimmedQuery && matchedCity) {
      setCurrentLocation(matchedCity);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`${latitude},${longitude}`);
          setSearchQuery("");
        },
        (error) => {
          alert(
            "Unable to get your location. Please search for a city manually. " +
              "Error: " +
              error.message,
          );
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-black to-gray-500 p-4">
      <div className="mx-auto flex max-w-7xl flex-col space-y-6">
        <nav className="sticky top-0 right-0 left-0 z-10 mb-6 border border-white/30 bg-white/20 p-4 shadow-xl backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Logo / Title */}
            <h1 className="text-center text-3xl font-bold text-white md:text-left">
              Weather{" "}
            </h1>

            {/* Search & Location */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
              <form
                onSubmit={handleSearch}
                className="relative w-full sm:w-auto"
              >
                <Search
                  className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-white/70"
                  size={20}
                />
                <Input
                  type="text"
                  name="search"
                  id="search"
                  aria-label="Search for a city"
                  placeholder="Search for a city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="sm:w-80a w-full border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/70"
                />
              </form>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={handleLocationClick}
                  className="border-white/30 bg-white/20 p-1 hover:bg-white/30"
                  title="Use current location"
                >
                  <MapPin className="text-white" size={24} />
                </Button>

                {/* Temperature Toggle */}
                <div className="flex w-fit bg-white/10 p-1">
                  <Button
                    size="sm"
                    variant={unit === "imperial" ? "default" : "ghost"}
                    onClick={() => setUnit("imperial")}
                    className="text-white"
                  >
                    °F
                  </Button>
                  <Button
                    size="sm"
                    variant={unit === "metric" ? "default" : "ghost"}
                    onClick={() => setUnit("metric")}
                    className="text-white"
                  >
                    °C
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <Weather location={currentLocation} unit={unit} />
        <HourlyWeather location={currentLocation} unit={unit} />
        <AstronomyInfo location={currentLocation} />
        <SevenDayForecast location={currentLocation} unit={unit} />
      </div>
    </div>
  );
}
