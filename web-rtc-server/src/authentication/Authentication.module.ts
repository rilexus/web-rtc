import { Module } from '@nestjs/common';
import { AuthenticationService } from './Authentication.service';
import { AuthenticationController } from './Authentication.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
