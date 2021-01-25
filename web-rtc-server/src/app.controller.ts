import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): any {
    return { some: 42 };
  }

  @Post('/login')
  login(): any {
    return { some: 42 };
  }
}
