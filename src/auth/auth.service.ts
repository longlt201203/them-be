import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { OAuth2Client } from 'google-auth-library';
import ThemConfig from '../etc/config';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { MailerService } from '../mailer/mailer.service';
import { randomUUID } from 'crypto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) {}

    async login(info: LoginDto) {
        const [user, err] = await this.usersService.findOneByEmailOrPhone(info.emailOrPhone);
        if (err) {
            return [null, err];
        }
        if (!user) {
            return [null, 'User not found'];
        }
        const isMatch = await this.cryptoService.validatePassword(info.password, user.userAuth.password);
        if (!isMatch) {
            return [null, 'Password is incorrect'];
        }
        const token = this.jwtService.sign({
            sub: user.id,
        }, {
            secret: ThemConfig.JWT_SECRET,
            expiresIn: ThemConfig.JWT_EXPIRES_IN
        });
        const refreshToken = this.jwtService.sign({
            sub: user.id,
            refresh_token_id: randomUUID(),
            remember: info.remember
        }, {
            secret: ThemConfig.REFRESH_TOKEN_SECRET,
            expiresIn: info.remember ? ThemConfig.REFRESH_TOKEN_DEFAULT_EXPIRES_IN : ThemConfig.REFRESH_TOKEN_REMEMBER_EXPIRES_IN
        });
        this.usersService.updateRefreshToken(user, refreshToken);
        return [{ access_token: token, refresh_token: refreshToken }, null];
    }

    async getInfoFromGoogle(credential: string) {
        const client = new OAuth2Client(ThemConfig.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: ThemConfig.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return [payload, null];
    }

    async loginWithGoogle(credential: string) {
        const [payload, err1] = await this.getInfoFromGoogle(credential);
        if (err1) {
            return [null, err1];
        }
        const email = payload.email;
        const [user, err2] = await this.usersService.findOneByEmailOrPhone(email);
        if (err2) {
            return [null, err2];
        }
        if (!user) {
            return [null, 'User not found'];
        }
        const token = this.jwtService.sign({
            sub: user.id,
        }, {
            secret: ThemConfig.JWT_SECRET,
            expiresIn: ThemConfig.JWT_EXPIRES_IN
        });
        const refreshToken = this.jwtService.sign({
            sub: user.id,
            refresh_token_id: randomUUID(),
            remember: true
        }, {
            secret: ThemConfig.REFRESH_TOKEN_SECRET,
            expiresIn: ThemConfig.REFRESH_TOKEN_REMEMBER_EXPIRES_IN
        });
        this.usersService.updateRefreshToken(user, refreshToken);
        return [{ access_token: token, refresh_token: refreshToken }, null];
    }

    async requestResetPassword(email: string) {
        const [user, err] = await this.usersService.findOneByEmailOrPhone(email);
        if (err) {
            return [null, err];
        }
        if (!user) {
            return [null, 'User not found'];
        }
        const code = this.cryptoService.randomNumberCode(6);
        const token = this.jwtService.sign({
            code: code,
        }, {
            secret: ThemConfig.RESET_PASSWORD_SECRET,
            expiresIn: ThemConfig.RESET_PASSWORD_EXPIRES_IN
        });
        this.usersService.updateResetPasswordToken(user, token);
        this.mailerService.sendResetPasswordEmail(email, code);
        return [email, null];
    }

    async resetPassword(info: ResetPasswordDto) {
        const [user, err] = await this.usersService.findOneByEmailOrPhone(info.email);
        if (err) {
            return [null, err];
        }
        if (!user) {
            return [null, 'User not found'];
        }
        try {
            const payload = this.jwtService.verify(user.userAuth.resetPasswordToken, {
                secret: ThemConfig.RESET_PASSWORD_SECRET,
                ignoreExpiration: false,
            });
            if (payload.code !== info.code) {
                return [null, 'Code is incorrect'];
            }
            const [updatedUser, err1] = await this.usersService.updatePassword(user.id, info.password);
            if (err1) {
                return [null, err1];
            }
            this.usersService.updateResetPasswordToken(updatedUser, null);
            return [updatedUser, null];
        } catch (err) {
            return [null, 'Invalid token or expired token'];
        }
    }

    async getAccessToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: ThemConfig.REFRESH_TOKEN_SECRET,
                ignoreExpiration: false,
            });
            const userId = payload.sub;
            const [user, err] = await this.usersService.findOneById(userId, true);
            if (err) {
                return [null, err];
            }
            if (!user) {
                return [null, 'User not found'];
            }
            const userAuthRefreshTokenPayload = this.jwtService.verify(user.userAuth.refreshToken, {
                secret: ThemConfig.REFRESH_TOKEN_SECRET,
                ignoreExpiration: false,
            });
            if (userAuthRefreshTokenPayload.refresh_token_id !== payload.refresh_token_id) {
                this.usersService.updateRefreshToken(user, null);
                return [null, 'Invalid token'];
            }
            const token = this.jwtService.sign({
                sub: user.id,
            }, {
                secret: ThemConfig.JWT_SECRET,
                expiresIn: ThemConfig.JWT_EXPIRES_IN
            });
            const newRefreshToken = this.jwtService.sign({
                sub: user.id,
                refresh_token_id: randomUUID(),
                remember: payload.remember
            }, {
                secret: ThemConfig.REFRESH_TOKEN_SECRET,
                expiresIn: payload.remember ? ThemConfig.REFRESH_TOKEN_REMEMBER_EXPIRES_IN : ThemConfig.REFRESH_TOKEN_DEFAULT_EXPIRES_IN
            });
            this.usersService.updateRefreshToken(user, newRefreshToken);
            return [{ access_token: token, refresh_token: newRefreshToken }, null];
        } catch (err) {
            return [null, 'Invalid token'];
        }
    }
}
