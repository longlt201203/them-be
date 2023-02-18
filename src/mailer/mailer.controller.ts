import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}
}
