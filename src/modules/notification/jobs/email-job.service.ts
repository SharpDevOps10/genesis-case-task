import { Inject, Injectable } from '@nestjs/common';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';
import { ISubscriptionService } from '@subscription/interfaces/subscription.service.interface';
import { IWeatherService } from '@weather/interfaces/weather.service.interface';
import { IEmailService } from '@email/interfaces/email-service.interface';
import { ILoggerService } from '@logger/logger.service.interface';

@Injectable()
export class EmailJobService {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_SERVICE)
    private readonly subscriptionService: ISubscriptionService,
    @Inject(DI_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService,
    @Inject(DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(DI_TOKENS.LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {}

  async sendWeatherEmailsByFrequency (frequency: SubscriptionFrequencyEnum): Promise<void> {
    const subscriptions = await this.subscriptionService.getConfirmedSubscriptions();
    const filtered = subscriptions.filter((s) => s.frequency === frequency);
    const label = frequency === SubscriptionFrequencyEnum.HOURLY ? 'hourly' : 'daily';

    for (const sub of filtered) {
      try {
        const weather = await this.weatherService.getWeather(sub.city);
        await this.emailService.sendWeatherUpdateEmail(sub.email, sub.city, weather, label);
        this.logger.log(`Sent weather to ${sub.email} [${sub.city}]`);
      } catch (err) {
        this.logger.error(`Failed to send to ${sub.email}: ${err.message}`);
      }
    }
  }
}
