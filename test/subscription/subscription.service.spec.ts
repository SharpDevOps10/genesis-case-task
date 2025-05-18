import { PrismaClient } from '@prisma/client';
import { SubscriptionService } from '@subscription/subscription.service';
import { IEmailService } from '@email/interfaces/email-service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { DI_TOKENS } from '@utils/tokens/DI-tokens';
import { SubscriptionRepository } from '@subscription/subscription.repository';
import { CreateSubscriptionDto } from '@subscription/dto/create-subscription.dto';
import { SubscriptionFrequencyEnum } from '@enums/subscription-frequency.enum';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

describe('SubscriptionService (integration)', () => {
  let service: SubscriptionService;
  let prisma: PrismaClient;

  const emailServiceMock: jest.Mocked<IEmailService> = {
    sendConfirmationEmail: jest.fn(),
    sendWeatherUpdateEmail: jest.fn(),
  };

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.subscription.deleteMany();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        PrismaService,
        {
          provide: DI_TOKENS.SUBSCRIPTION_REPOSITORY,
          useClass: SubscriptionRepository,
        },
        {
          provide: DI_TOKENS.EMAIL_SERVICE,
          useValue: emailServiceMock,
        },
      ],
    }).compile();

    service = module.get(SubscriptionService);
  });

  it('should create subscription and send email', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'test@example.com',
      city: 'Kyiv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    const dbEntry = await prisma.subscription.findFirst({
      where: { email: dto.email, city: dto.city },
    });

    expect(dbEntry).toBeDefined();
    expect(dbEntry?.token).toBeDefined();
    expect(emailServiceMock.sendConfirmationEmail).toHaveBeenCalledWith(dto.email, dbEntry?.token);
  });

  it('should throw ConflictException if subscription already exists', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'dup@example.com',
      city: 'Lviv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    await expect(service.subscribe(dto)).rejects.toThrow(ConflictException);
  });

  it('should confirm a subscription', async () => {
    const dto: CreateSubscriptionDto = {
      email: 'confirm@example.com',
      city: 'Odesa',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);

    const sub = await prisma.subscription.findFirstOrThrow({
      where: { email: dto.email },
    });

    await service.confirm(sub);

    const updated = await prisma.subscription.findUnique({ where: { id: sub.id } });

    expect(updated?.confirmed).toBe(true);
  });

  it('should throw ConflictException if already confirmed', async () => {
    const dto = {
      email: 'confirmed@example.com',
      city: 'Dnipro',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });
    await service.confirm(sub);

    await expect(service.confirm({ ...sub, confirmed: true })).rejects.toThrow(ConflictException);
  });

  it('should unsubscribe confirmed user', async () => {
    const dto = {
      email: 'unsub@example.com',
      city: 'Kharkiv',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await service.confirm(sub);

    await service.unsubscribe({ ...sub, confirmed: true });

    const found = await prisma.subscription.findUnique({ where: { id: sub.id } });
    expect(found).toBeNull();
  });

  it('should not allow unsubscribe if not confirmed', async () => {
    const dto = {
      email: 'not-confirmed@example.com',
      city: 'Paris',
      frequency: SubscriptionFrequencyEnum.DAILY,
    };

    await service.subscribe(dto);
    const sub = await prisma.subscription.findFirstOrThrow({ where: { email: dto.email } });

    await expect(service.unsubscribe(sub)).rejects.toThrow(ConflictException);
  });
});