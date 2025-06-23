import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { env } from '~/env';
import type { TAstronomyData, TCurrentWeatherData, TForecastData, TWeatherAPIError } from '~/interface/interface.index';

const BASE_URL = 'http://api.weatherapi.com/v1';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint');
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
  }

  const params = new URLSearchParams(searchParams);
  params.delete('endpoint'); // Remove endpoint so it doesn't go to WeatherAPI
  params.set('key', env.API_KEY); // Append your private key securely

  const weatherUrl = `${BASE_URL}${endpoint}?${params.toString()}`;

  try {
    const res = await fetch(weatherUrl);
    const data = await res.json() as TCurrentWeatherData | TForecastData | TAstronomyData | TWeatherAPIError ;
    if (!res.ok ) { 
      const errorData = await res.json() as TWeatherAPIError;
      return NextResponse.json(errorData, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err ?? 'Server error fetching weather data' }, { status: 500 });
  }
}
