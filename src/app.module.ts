import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CryptoService } from './crypto/crypto.service';
import { CryptoModule } from './crypto/crypto.module';
import { LocalFilesModule } from './local-files/local-files.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    CryptoModule,
    LocalFilesModule
  ],
  controllers: [AppController],
  providers: [AppService, CryptoService],
})
export class AppModule {}
