import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherResponse } from './responses/get-weather.response';

@Controller('weather')
export class WeatherController {
  constructor (private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather (@Query('city') city: string): Promise<GetWeatherResponse> {
    return this.weatherService.getWeather(city);
  }
}