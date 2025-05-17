import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { randomUUID } from 'node:crypto';
import { IEmailService } from '@email/interfaces/email-service.interface';

@Injectable()
export class SubscriptionService {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(DI_TOKENS.EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<{ message: string }> {
    const { email, city } = dto;
    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) throw new ConflictException('Email already subscribed for this city');

    const token = randomUUID();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
    await this.emailService.sendConfirmationEmail(email, token);

    return {
      message: 'Subscription successful. Confirmation email sent.',
    };
  }
}