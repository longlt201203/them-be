import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
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
}
