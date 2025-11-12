import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@app/user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = this.userService.findByUsername(username);
    if (!user || user.password !== password) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = { sub: user.id, role: user.role };

    return {
      access_token: this.jwt.sign(payload),
    };
  }
}
