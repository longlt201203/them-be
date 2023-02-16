import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { resolve } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    return res.sendFile(resolve(__dirname + '/../index.html'));
  }
}
