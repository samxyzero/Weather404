
import type { TAstronomyData,  TCurrentWeatherData, TForecastData, TLocation, TWeatherAPIError } from "~/interface/interface.index";


export async function fetchWeatherFromServer<T>(endpoint: string, params: Record<string, string | number>): Promise<T> {
  const searchParams = new URLSearchParams({ endpoint });
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value.toString());
  }

  try {
    const res = await fetch(`/api/weather?${searchParams.toString()}`);
    if (!res.ok) {
      const errorData: TWeatherAPIError = await res.json() as TWeatherAPIError;
      throw new Error(`WeatherAPI Error: ${errorData.error.message} (Code: ${errorData.error.code})`);
    }
    return await res.json() as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch weather data');
  }
}

export async function getCurrentWeather(
  location: string,
  options: {
    aqi?: boolean;
    lang?: string;
  } = {}
): Promise<TCurrentWeatherData> {
  const params: Record<string, string | number> = {
    q: location,
  };

  if (options.aqi !== undefined) {
    params.aqi = options.aqi ? 'yes' : 'no';
  }

  if (options.lang) {
    params.lang = options.lang;
  }

  return fetchWeatherFromServer('/current.json', params);
  // return makeWeatherRequest<TCurrentWeatherData>('/current.json', params);
}


export async function getForecast(
  location: string,
  days = 3,
  options: {
    aqi?: boolean;
    alerts?: boolean;
    hour?: number;
    lang?: string;
  } = {}
): Promise<TForecastData> {
  if (days < 1 || days > 14) {
    throw new Error('Days parameter must be between 1 and 14');
  }

  const params: Record<string, string | number> = {
    q: location,
    days,
  };

  if (options.aqi !== undefined) {
    params.aqi = options.aqi ? 'yes' : 'no';
  }

  if (options.alerts !== undefined) {
    params.alerts = options.alerts ? 'yes' : 'no';
  }

  if (options.hour !== undefined) {
    if (options.hour < 0 || options.hour > 23) {
      throw new Error('Hour parameter must be between 0 and 23');
    }
    params.hour = options.hour;
  }

  if (options.lang) {
    params.lang = options.lang;
  }

  return fetchWeatherFromServer('/forecast.json', params) ;
  // return makeWeatherRequest<TForecastData>('/forecast.json', params);
  
}

export async function getAstronomy(
   location: TLocation,
  date?: string
): Promise<TAstronomyData> {
  const params: Record<string, string> = { q: location };
  if (date) {
    params.dt = date;
  }

  return fetchWeatherFromServer('/astronomy.json', params);
  // return makeWeatherRequest<TAstronomyData>('/astronomy.json', params);
}

