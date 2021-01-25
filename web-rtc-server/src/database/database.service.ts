import { Injectable } from '@nestjs/common';
import { User } from '../user/types/User.type';

const users: User[] = [
  {
    id: 'oi2190djkld1',
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496',
      },
    },
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
  },
  {
    id: 'akkssow2',
    name: 'Ervin Howell',
    username: 'Ervin',
    email: 'Shanna@melissa.tv',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: {
        lat: '-43.9509',
        lng: '-34.4618',
      },
    },
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains',
    },
  },
];

@Injectable()
export class DatabaseService {
  async getUserById(id: string): Promise<User | undefined> {
    return users.find(({ id: userId }) => id === userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return users.find(({ email: userEmail }) => userEmail === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return users.find(({ username: userName }) => username === userName);
  }
}
