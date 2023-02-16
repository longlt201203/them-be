import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { OAuth2Client } from 'google-auth-library';
import ThemConfig from '../etc/config';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly cryptoService: CryptoService,
        private readonly jwtService: JwtService
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
        });
        return [token, null];
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
        });
        return [token, null];
    }
}
