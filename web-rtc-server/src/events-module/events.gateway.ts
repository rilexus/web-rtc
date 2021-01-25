import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ClientStore } from './client-store/ClientStore';
import { AuthenticationService } from '../authentication/Authentication.service';

enum ACTION_TYPES {
  userListUpdate = 'userListUpdate',
}
function createUserListUpdateAction(list: any[]) {
  return { type: ACTION_TYPES.userListUpdate, list };
}

@WebSocketGateway({
  transport: ['websocket'],
  path: '/socket', //
})
class EventsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  logger = new Logger('EventsGateway');

  constructor(
    private clientStore: ClientStore,
    private readonly authService: AuthenticationService,
  ) {}

  @SubscribeMessage('events')
  findAll(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('associate')
  async associate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { username, socketId } = data;
    this.clientStore.addClient(username, socketId);
    await this.sentUserListUpdate(this.server);
  }

  @SubscribeMessage('reloadUserList')
  async reloadUserList(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await this.sentUserListUpdate(client);
  }

  @SubscribeMessage('video:offer')
  async videoOffer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { offer, to, from } = data;
    console.log(offer, from, to);
    const userClient = this.getClientById(to);
    if (offer) {
      userClient.emit('video:offer', { offer, to, from });
    }
  }

  @SubscribeMessage('onicecandidate')
  async onicecandidate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { candidate, to, from } = data;
    const userClient = this.getClientById(to);
    if (candidate) {
      userClient.emit('onicecandidate', {
        candidate: candidate,
        to: from,
        from: to,
      });
    }
  }

  private getSocketId(username: string): string {
    return this.clientStore.getSocketId(username);
  }

  private getClientById(id: string): any {
    // console.log({ connected: this.server.sockets, id });
    return this.server.sockets.connected[id];
  }
  private getClientByUsername(username: string) {
    return this.getClientById(this.clientStore.getSocketId(username));
  }

  @SubscribeMessage('video:answer')
  async videoAnswer(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { answer, to, from } = data;
    const userClient = this.getClientById(to);
    if (answer) {
      userClient.emit('video:answer', { answer, to, from });
    }
  }

  async sentUserListUpdate(client) {
    await this.sendTo(
      client,
      createUserListUpdateAction(
        Object.entries(this.clientStore.getClients()).map(
          ([username, socketId]) => ({
            name: username,
            socketId: socketId,
          }),
        ),
      ),
    );
  }

  async sendTo(client: any, action: { type: string; [key: string]: any }) {
    const { type, ...rest } = action;
    client.emit(type, rest);
  }

  handleConnection(client: any, ...args): any {
    // console.log(this.authService.loggedInUsers);
  }

  afterInit(server: any): any {
    this.logger.log('INIT');
  } //

  async handleDisconnect(client: any): Promise<void> {
    const { id } = client;
    this.clientStore.removeClientBySocketId(id);
    await this.sentUserListUpdate(this.server);
  }
}
export { EventsGateway };
