import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ClientStore } from './client-store/ClientStore';
import { AuthenticationModule } from '../authentication/Authentication.module';

@Module({
  imports: [AuthenticationModule],
  providers: [EventsGateway, ClientStore],
  exports: [EventsGateway],
})
export class EventsModule {}
