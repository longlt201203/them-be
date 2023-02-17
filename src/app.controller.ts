import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { resolve } from 'path';
import { AppService } from './app.service';
import { MailerService } from './mailer/mailer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService
  ) {}

  @Get()
  getHello(@Res() res: Response) {
    return res.sendFile(resolve(__dirname + '/../index.html'));
  }

  @Get('test-mailer')
  async testMailer() {
    this.mailerService.test();
  }
}
