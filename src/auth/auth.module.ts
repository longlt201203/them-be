import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { JwtModule } from '@nestjs/jwt';
import ThemConfig from '../etc/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [JwtModule.register({
        secret: ThemConfig.JWT_SECRET,
        signOptions: {
            expiresIn: ThemConfig.JWT_EXPIRES_IN
        }
    }), UsersModule, CryptoModule],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
