import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmailService } from './interfaces/email-service.interface';

@Injectable()
export class EmailService implements IEmailService {
  constructor (private readonly mailerService: MailerService) {}

  async sendConfirmationEmail (email: string, token: string): Promise<void> {
    const confirmUrl = `${ process.env.FRONTEND_URL }/api/confirm/${ token }`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your weather subscription',
      template: 'confirm',
      context: {
        confirmUrl,
      },
    });
  }
}