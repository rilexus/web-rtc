import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserByUsername(username: string) {
    return this.databaseService.getUserByUsername(username);
  }

  async getUserById(id: string) {
    return this.databaseService.getUserById(id);
  }
}
