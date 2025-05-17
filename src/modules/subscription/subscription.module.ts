import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { PrismaModule } from '@database/prisma.module';

@Module({
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    {
      provide: DI_TOKENS.SUBSCRIPTION_REPOSITORY,
      useClass: SubscriptionRepository,
    },
  ],
  imports: [PrismaModule],
})
export class SubscriptionModule {}