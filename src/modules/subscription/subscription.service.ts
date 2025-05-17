import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SubscriptionService {
  constructor (
    @Inject(DI_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async subscribe (dto: CreateSubscriptionDto): Promise<void> {
    const { email, city } = dto;
    const existingSubscription = await this.subscriptionRepository.findByEmailAndCity(email, city);
    if (existingSubscription) throw new ConflictException('Email already subscribed for this city');

    const token = randomUUID();

    await this.subscriptionRepository.createSubscription({ ...dto, token });
  }
}