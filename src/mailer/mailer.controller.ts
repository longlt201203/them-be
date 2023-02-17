import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailerService: MailerService) {}

    @Post('send-reset-password-email')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    example: 'longltse172125@fpt.edu.vn'
                }
            }
        }
    })
    async sendResetPasswordEmail(@Body() info: any) {
        const [result, err] = await this.mailerService.sendResetPasswordEmail(info.email);
        if (err) {
            return {
                success: false,
                message: err
            };
        }
        return {
            success: true,
            message: 'Send reset password email success'
        };
    }
}
