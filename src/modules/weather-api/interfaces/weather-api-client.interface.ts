import { WeatherApiResponse } from '../responses/weather-api.response';

export interface IWeatherApiClient {
  getWeatherData(city: string): Promise<WeatherApiResponse>;
}