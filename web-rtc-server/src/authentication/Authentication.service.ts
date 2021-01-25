import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userService: UserService) {}
  loggedInUsers: {
    [name: string]: any;
  } = {};

  addToLoggedIn(user) {
    this.loggedInUsers[user.username] = user;
  }

  removeFromLoggedIn(username) {
    if (this.loggedInUsers[username]) {
      const { [username]: user, ...rest } = this.loggedInUsers;
      this.loggedInUsers = rest;
    }
  }

  async logout(username: string) {
    this.removeFromLoggedIn(username);
    return;
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.userService.getUserByUsername(username);
    // TODO: check for password!
    if (!user) {
      return;
    }
    this.addToLoggedIn(user);
    return {
      key: 'somekey', // TODO: generate JWT token
    };
  }
}
