import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from '@weather/weather.module';
import { SubscriptionModule } from '@modules/subscription/subscription.module';

@Module({
  imports: [WeatherModule, SubscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
