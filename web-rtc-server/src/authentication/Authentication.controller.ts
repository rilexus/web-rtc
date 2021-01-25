import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from './Authentication.service';

@Controller('/api/authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/login')
  async login(@Body() body: any): Promise<any> {
    const { username, password } = body;
    const login = await this.authService.login(username, password);
    if (!login) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return login;
  }

  @Post('/logout')
  logout(@Body() body: any): any {
    const { username } = body;
    return this.authService.logout(username);
  }
}
