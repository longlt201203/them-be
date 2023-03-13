import { Module } from '@nestjs/common';
import { ZipService } from './zip.service';
import { ZipController } from './zip.controller';

@Module({
  providers: [ZipService],
  controllers: [ZipController]
})
export class ZipModule {}
