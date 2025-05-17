import { IsEmail, IsEnum, IsString } from 'class-validator';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';

export class CreateSubscriptionDto {
  @IsEmail()
    email: string;

  @IsString()
    city: string;

  @IsEnum(SubscriptionFrequencyEnum)
    frequency: SubscriptionFrequencyEnum;
}