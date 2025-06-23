"use client";
import { useState, useEffect } from 'react';
import { Sun, Sunrise, Sunset, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';

import type { TAstronomyData } from '~/interface/interface.index';
import { getAstronomy } from '~/lib/weather.api';

interface AstronomyComponentProps {
  location?: string;
}

interface SunMoonStats {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  value: string;
  subValue?: string;
}

export function SunInfo({ location = 'Pokhara' }: AstronomyComponentProps) {
  const [astronomyData, setAstronomyData] = useState<TAstronomyData | null>(null);
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
        setError(err instanceof Error ? err.message : 'Failed to fetch astronomy data');
      } finally {
        setLoading(false);
      }
    };

    void fetchAstronomyData();
  }, [location]);

  const getCurrentSunPhase = (): 'sunrise' | 'daylight' | 'sunset' | 'night' => {
    if (!astronomyData) return 'daylight';
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const sunrise = astronomyData.astronomy.astro.sunrise;
    const sunset = astronomyData.astronomy.astro.sunset;
    
    // Convert 12-hour format to 24-hour for comparison
    const convertTo24Hour = (time: string) => {
      const [timePart, period] = time.split(' ');
      const [hoursRaw, minutesRaw] = (timePart ?? '00:00').split(':');
      let hours = Number(hoursRaw ?? '0');
      const minutes = Number(minutesRaw ?? '0');
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    const sunriseTime = convertTo24Hour(sunrise);
    const sunsetTime = convertTo24Hour(sunset);
    
    if (currentTime >= sunriseTime && currentTime < sunsetTime) {
      const sunriseHour = parseInt(sunriseTime.split(':')[0] ?? '0');
      const currentHour = parseInt(currentTime.split(':')[0] ?? '0');
      if (currentHour - sunriseHour <= 1) return 'sunrise';
      
      const sunsetHour = parseInt(sunsetTime.split(':')[0] ?? '0');
      if (sunsetHour - currentHour <= 1) return 'sunset';
      
      return 'daylight';
    }
    return 'night';
  };

  const getSunStats = (): SunMoonStats[] => {
    if (!astronomyData) return [];

    const phase = getCurrentSunPhase();
    const phaseLabel = phase === 'sunrise' ? 'Sunrise' : 
                      phase === 'sunset' ? 'Sunset' : 
                      phase === 'daylight' ? 'Daylight' : 'Night';

    return [
      {
        icon: Sunrise,
        label: 'Sunrise',
        value: astronomyData.astronomy.astro.sunrise
      },
      {
        icon: Sunset,
        label: 'Sunset',
        value: astronomyData.astronomy.astro.sunset
      },
      {
        icon: Clock,
        label: 'Current Phase',
        value: phaseLabel
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">Loading sun data...</div>
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

  if (!astronomyData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">No sun data available</div>
      </div>
    );
  }

  const currentPhase = getCurrentSunPhase();

  return (
    <Card className="backdrop-blur-md bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-300/30 shadow-xl">
      <CardContent className="text-center w-full p-6">
        <div className="flex items-center justify-center mb-3">
          <MapPin className="text-white/80 mr-3" size={20} />
          <p className="text-white/90 font-medium text-xl">{astronomyData.location.name}</p>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <Sun className="text-yellow-300" size={80} />
        </div>
        
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Sun Information</h2>
          <p className="text-white/90 text-xl mb-4">Current Phase: {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {getSunStats().map((stat, index) => {
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
  );
}

export function MoonInfo({ location = 'Pokhara' }: AstronomyComponentProps) {
  const [astronomyData, setAstronomyData] = useState<TAstronomyData | null>(null);
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
        setError(err instanceof Error ? err.message : 'Failed to fetch astronomy data');
      } finally {
        setLoading(false);
      }
    };

    void fetchAstronomyData();
  }, [location]);

  const getMoonPhaseIcon = (phase: string) => {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes('new')) return '🌑';
    if (phaseLower.includes('waxing crescent')) return '🌒';
    if (phaseLower.includes('first quarter')) return '🌓';
    if (phaseLower.includes('waxing gibbous')) return '🌔';
    if (phaseLower.includes('full')) return '🌕';
    if (phaseLower.includes('waning gibbous')) return '🌖';
    if (phaseLower.includes('last quarter') || phaseLower.includes('third quarter')) return '🌗';
    if (phaseLower.includes('waning crescent')) return '🌘';
    return '🌙';
  };

  const getMoonStats = (): SunMoonStats[] => {
    if (!astronomyData) return [];

    return [
      {
        icon: () => <span className="text-2xl">{getMoonPhaseIcon(astronomyData.astronomy.astro.moon_phase)}</span>,
        label: 'Moon Phase',
        value: astronomyData.astronomy.astro.moon_phase
      },
      {
        icon: () => <span className="text-xl">🌅</span>,
        label: 'Moonrise',
        value: astronomyData.astronomy.astro.moonrise
      },
      {
        icon: () => <span className="text-xl">🌄</span>,
        label: 'Moonset',
        value: astronomyData.astronomy.astro.moonset
      },
      {
        icon: () => <span className="text-xl">💡</span>,
        label: 'Illumination',
        value: `${astronomyData.astronomy.astro.moon_illumination}%`
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">Loading moon data...</div>
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

  if (!astronomyData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white text-xl">No moon data available</div>
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-md bg-gradient-to-br from-blue-600/20 to-purple-700/20 border-blue-300/30 shadow-xl">
      <CardContent className="text-center w-full p-6">
        <div className="flex items-center justify-center mb-3">
          <MapPin className="text-white/80 mr-3" size={20} />
          <p className="text-white/90 font-medium text-xl">{astronomyData.location.name}</p>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <span className="text-8xl">
            {getMoonPhaseIcon(astronomyData.astronomy.astro.moon_phase)}
          </span>
        </div>
        
        <div>
          <h2 className="text-4xl font-bold text-white mb-2">Moon Information</h2>
          <p className="text-white/90 text-xl mb-4">{astronomyData.astronomy.astro.moon_phase}</p>
          <p className="text-white/70 text-lg">{astronomyData.astronomy.astro.moon_illumination}% Illuminated</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {getMoonStats().map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="backdrop-blur-md bg-white/10 border-white/20 p-4 text-center rounded-lg">
                <div className="flex justify-center mb-2">
                  <IconComponent className="text-white/80" size={24} />
                </div>
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
  );
}


export default function AstronomyInfo({ location  }: AstronomyComponentProps) {
  return (
    <div className="space-y-6 ">
      <SunInfo location={location} />
      <MoonInfo location={location} />
    </div>
  );
}