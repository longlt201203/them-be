import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import ThemConfig from "../etc/config";
import { Transporter } from "nodemailer";

@Injectable()
export class MailerService {
    constructor(
        @Inject('TRANSPORTER')
        private readonly transporter: Transporter,
        private readonly usersService: UsersService,
    ) {}

    test() {
        console.log(ThemConfig.MAILER_USER);
        console.log(ThemConfig.MAILER_PASS);
        this.transporter.verify((err, success) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server is ready to take our messages');
                this.transporter.sendMail({
                    to: 'phamm5687@gmail.com',
                    subject: 'Thư gửi Minh',
                    html: '<h1>Xin chào bạn Phạm Công Minh.</h1><p>Nếu như bạn nhận được bức thư này thì bạn Lê Thành Long đang chạy deadline và test chức năng spam mail lên mail của bạn.</p>',
                }).then((info) => {
                    console.log(info);
                });
            }
        });
    }

    async sendResetPasswordEmail(email: string, code: string) {
        const result = await this.transporter.sendMail({
            to: email,
            subject: 'Reset password',
            html: `<p>You reset password code is <b>${code}</b>.</p>`,
        });
        return [result, null];
    }
}