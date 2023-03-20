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
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from '../users/entities/user-auth.entity';
import { Repository } from 'typeorm';
import { VerifyResetPasswordCodeDto } from './dtos/verify-reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        @InjectRepository(UserAuth)
        private readonly userAuthRepository: Repository<UserAuth>
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
        user.userAuth.refreshToken = refreshToken;
        user.userAuth.lastLoggedIn = new Date();
        this.userAuthRepository.save(user.userAuth);
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

    async registerWithGoole(credential: string) {
        const [info, err] = await this.getInfoFromGoogle(credential);
        if (err) {
            return [null, err];
        }
        const [user, err1] = await this.usersService.findOneByEmailOrPhone(info.email);
        if (err1) {
            return [null, err1];
        }
        if (user) {
            return [null, 'User already exists'];
        }
        const [createdUser, err2] = await this.usersService.createOne({
            email: info.email,
            fname: info.given_name,
            lname: info.family_name,
            address: null,
            phone: null,
            avt: null,
            cover: null,
            password: null,
            zipCode: null,
        });
        if (err2) {
            return [null, err2];
        }
        const token = this.jwtService.sign({
            sub: createdUser.id,
        }, {
            secret: ThemConfig.JWT_SECRET,
            expiresIn: ThemConfig.JWT_EXPIRES_IN
        });
        const refreshToken = this.jwtService.sign({
            sub: createdUser.id,
            refresh_token_id: randomUUID(),
            remember: true
        }, {
            secret: ThemConfig.REFRESH_TOKEN_SECRET,
            expiresIn: ThemConfig.REFRESH_TOKEN_REMEMBER_EXPIRES_IN
        });
        createdUser.userAuth.refreshToken = refreshToken;
        const now = new Date();
        createdUser.userAuth.lastLoggedIn = now;
        createdUser.userAuth.verifyEmailAt = now;
        this.userAuthRepository.save(createdUser.userAuth);
        return [{ access_token: token, refresh_token: refreshToken }, null];
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
        user.userAuth.refreshToken = refreshToken;
        user.userAuth.lastLoggedIn = new Date();
        this.userAuthRepository.save(user.userAuth);
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
        user.userAuth.resetPasswordToken = token;
        this.userAuthRepository.save(user.userAuth);
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
        if (!user.userAuth.isResetPassword) {
            return [null, 'You cannot reset password'];
        }
        user.userAuth.password = await this.cryptoService.hashPassword(info.password);
        user.userAuth.resetPasswordToken = null;
        user.userAuth.refreshToken = null;
        user.userAuth.isResetPassword = false;
        this.userAuthRepository.save(user.userAuth);
        return [user, null];
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
                user.userAuth.refreshToken = null;
                this.userAuthRepository.save(user.userAuth);
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
            user.userAuth.refreshToken = newRefreshToken;
            this.userAuthRepository.save(user.userAuth);
            return [{ access_token: token, refresh_token: newRefreshToken }, null];
        } catch (err) {
            return [null, 'Invalid token'];
        }
    }

    async verifyResetPasswordToken(info: VerifyResetPasswordCodeDto) {
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
            user.userAuth.isResetPassword = true;
            this.userAuthRepository.save(user.userAuth);
            return [null, null];
        } catch (err) {
            return [null, 'Invalid token or expired token'];
        }
    }

    async requestVerifyEmail(email: string) {
        const [user, err] = await this.usersService.findOneByEmailOrPhone(email);
        if (err) {
            return [null, err];
        }
        if (!user) {
            return [null, 'User not found'];
        }
        if (user.userAuth.verifyEmailAt) {
            return [null, 'Email has been verified'];
        }
        const code = this.cryptoService.randomNumberCode(6);
        const token = this.jwtService.sign({
            code: code,
        }, {
            secret: ThemConfig.RESET_PASSWORD_SECRET,
            expiresIn: ThemConfig.RESET_PASSWORD_EXPIRES_IN
        });
        user.userAuth.verifyEmailToken = token;
        this.userAuthRepository.save(user.userAuth);
        this.mailerService.sendVerifyEmail(email, code);
        return [email, null];
    }

    async verifyEmail(info: VerifyResetPasswordCodeDto) {
        const [user, err] = await this.usersService.findOneByEmailOrPhone(info.email);
        if (err) {
            return [null, err];
        }
        if (!user) {
            return [null, 'User not found'];
        }
        try {
            const payload = this.jwtService.verify(user.userAuth.verifyEmailToken, {
                secret: ThemConfig.RESET_PASSWORD_SECRET,
                ignoreExpiration: false,
            });
            if (payload.code !== info.code) {
                return [null, 'Code is incorrect'];
            }
            user.userAuth.verifyEmailAt = new Date();
            user.userAuth.verifyEmailToken = null;
            this.userAuthRepository.save(user.userAuth);
            return [null, null];
        } catch (err) {
            return [null, 'Invalid token or expired token'];
        }
    }
}
