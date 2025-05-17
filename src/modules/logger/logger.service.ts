import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from '@logger/logger.service.interface';

@Injectable()
export class LoggerService implements ILoggerService {
  private readonly logger = new Logger('NotificationService');

  log (message: string) {
    this.logger.log(message);
  }

  error (message: string, trace?: string) {
    this.logger.error(message, trace);
  }
}
