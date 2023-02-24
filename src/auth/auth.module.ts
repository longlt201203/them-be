import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailerModule } from '../mailer/mailer.module';
import { UserAuth } from '../users/entities/user-auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [JwtModule, UsersModule, CryptoModule, MailerModule, TypeOrmModule.forFeature([UserAuth])],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
