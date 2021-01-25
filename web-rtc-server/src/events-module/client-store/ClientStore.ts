import { Injectable } from '@nestjs/common';

type SocketId = string;

@Injectable()
export class ClientStore {
  private connectedClients: { [username: string]: SocketId } = {};

  addClient(username: string, socketId: string) {
    if (!this.connectedClients[username]) {
      this.connectedClients[username] = socketId;
    }
  }

  getSocketId(username: string) {
    return this.connectedClients[username];
  }

  removeClientByUsername(username: string) {
    if (this.connectedClients[username]) {
      const { [username]: client, ...rest } = this.connectedClients;
      this.connectedClients = rest;
    }
  }

  removeClientBySocketId(id: string) {
    this.connectedClients = Object.fromEntries(
      Object.entries(this.connectedClients).filter(
        ([name, socketId]) => id !== socketId,
      ),
    );
  }

  getClients() {
    return this.connectedClients;
  }
}
