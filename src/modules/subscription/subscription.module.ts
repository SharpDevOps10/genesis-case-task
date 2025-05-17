import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { PrismaModule } from '@database/prisma.module';
import { EmailModule } from '@email/email.module';
import { IsCityValidConstraint } from '@utils/validators/is-city-valid.validator';
import { WeatherModule } from '@weather/weather.module';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    IsCityValidConstraint,
    {
      provide: DI_TOKENS.SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
  ],
  imports: [PrismaModule, EmailModule, WeatherModule],
})
export class SubscriptionModule {}