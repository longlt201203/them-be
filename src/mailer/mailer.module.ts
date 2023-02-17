import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import * as nodemailer from 'nodemailer';
import ThemConfig from '../etc/config';
@Module({
    providers: [
        {
            provide: 'TRANSPORTER',
            useValue: nodemailer.createTransport({
                host: ThemConfig.SMTP_HOST,
                port: ThemConfig.SMTP_PORT,
                secure: false,
                auth: {
                    user: ThemConfig.MAILER_USER,
                    pass: ThemConfig.MAILER_PASS
                }
            })
        },
        MailerService
    ],
    exports: [MailerService],
    imports: [UsersModule],
    controllers: [MailerController]
})
export class MailerModule {}
