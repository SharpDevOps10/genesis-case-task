import { Subscription } from '@prisma/client';
import { CreateSubscriptionDto } from '@subscription/dto/create-subscription.dto';

export interface ISubscriptionRepository {
  findByEmailAndCity (email: string, city: string): Promise<Subscription>;
  createSubscription (data: CreateSubscriptionDto & { token: string }): Promise<void>;
}