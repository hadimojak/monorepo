import { Injectable } from '@nestjs/common';
import { Role } from 'apps/auth/src/role.enum';

@Injectable()
export class UserService {
  private users = [
    {
      id: 1,
      username: 'admin',
      password: '123',
      role: Role.ADMIN,
    },
    {
      id: 2,
      username: 'manager',
      password: '123',
      role: Role.MANAGER,
    },
    {
      id: 3,
      username: 'user',
      password: '123',
      role: Role.USER,
    },
  ];

  findByUsername(username: string) {
    return this.users.find(
      (val) => val.username === username,
    );
  }
}
