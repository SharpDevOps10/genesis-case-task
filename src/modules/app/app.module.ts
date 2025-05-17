import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from '@weather/weather.module';
import { SubscriptionModule } from '@subscription/subscription.module';
import { NotificationModule } from '@notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    WeatherModule,
    SubscriptionModule,
    NotificationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
