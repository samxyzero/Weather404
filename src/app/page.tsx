"use client"
import HourlyWeather from "~/components/hourly.Weather";
import Weather from "~/components/weather";
import { MapPin, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { GetLocation } from "~/lib/location";
import AstronomyInfo from "~/components/astronomy";
import SevenDayForecast from "~/components/forecast";


export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentLocation, setCurrentLocation] = useState<string>( GetLocation() ?? 'Pokhara')
    const [unit, setUnit] = useState<"metric" | "imperial">("imperial");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setCurrentLocation(searchQuery.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation(`${latitude},${longitude}`);
                    setSearchQuery('');
                },
                (error) => {
                    alert('Unable to get your location. Please search for a city manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-400 via-black to-gray-500 p-4">
            <div className="max-w-7xl mx-auto flex flex-col space-y-6">
                <nav className="backdrop-blur-md bg-white/20 p-6 border border-white/30 shadow-xl mb-6  top-0 left-0 right-0 z-10 sticky">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">Weather</h1>
                        <div className="flex items-center space-x-3">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                                <Input
                                    type="text"
                                    name="search"
                                    id="search"
                                    autoComplete="off"
                                    autoFocus
                                    aria-label="Search for a city"

                                    placeholder="Search for a city..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
                                />
                            </form>
                            <Button
                                size="icon"
                                onClick={handleLocationClick}
                                className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm"
                                title="Use current location"
                            >
                                <MapPin className="text-white" size={20} />
                            </Button>
                        </div>
                        <div className="flex bg-white/10 p-1">
                            <Button
                                size="sm"
                                variant={unit === "imperial" ? "default" : "ghost"}
                                onClick={() => setUnit("imperial")}
                                className="text-white rounded-xl"
                            >
                                °F
                            </Button>
                            <Button
                                size="sm"
                                variant={unit === "metric" ? "default" : "ghost"}
                                onClick={() => setUnit("metric")}
                                className="text-white rounded-xl"
                            >
                                °C
                            </Button>
                        </div>
                    </div>
                </nav>
                <Weather location={currentLocation} unit={unit} />
                <HourlyWeather location={currentLocation} unit={unit} />     
                <AstronomyInfo location={currentLocation}  />   
                <SevenDayForecast location={currentLocation} unit={unit} />
            </div>
        </div>
    );
}