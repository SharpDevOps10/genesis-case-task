import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller('subscribe')
export class SubscriptionController {
  constructor (private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async subscribe (@Body() body: CreateSubscriptionDto): Promise<{ message: string }> {
    return this.subscriptionService.subscribe(body);
  }
}