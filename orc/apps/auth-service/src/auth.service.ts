import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { jwtHelperService } from '@app/auth-lib/jwt-helper/jwt-helper.service';
import * as bcrypt from 'bcrypt';
import { UUID, randomUUID } from 'crypto';

type User = {
  id: UUID;
  email: string;
  passwordHash: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtHelper: jwtHelperService) {}

  //in memory store for users
  private usersByEmail = new Map<string, User>();

  async signup(email: string, password: string) {
    //replcae with query
    if (this.usersByEmail.has(email))
      throw new ConflictException('user already exict');
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: randomUUID(),
      email,
      passwordHash,
    };
    this.usersByEmail.set(email, user);

    const { accessToken, refreshToken, expiresIn, payload } =
      await this.jwtHelper.issueTokenPair(user.id, user.email);

    this.jwtHelper.add(user.id, refreshToken);

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  async login(email: string, password: string) {
    const user = this.usersByEmail.get(email);
    if (!user)
      throw new UnauthorizedException('invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      throw new UnauthorizedException('invalid credentials');

    const { accessToken, refreshToken, expiresIn, payload } =
      await this.jwtHelper.issueTokenPair(user.id, user.email);

    this.jwtHelper.add(user.id, refreshToken);
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  async refresh(refreshToken: string) {
    const payload =
      await this.jwtHelper.verifyRefresh(refreshToken);

    if (!this.jwtHelper.has(payload.sub, refreshToken)) {
      throw new UnauthorizedException('refresh token revoked');
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      payload: newPayload,
    } = await this.jwtHelper.issueTokenPair(
      payload.sub,
      payload.email,
    );

    this.jwtHelper.revoke(newPayload.sub, refreshToken);
    this.jwtHelper.revoke(newPayload.sub, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  async logout(refreshToken: string) {
    const payload =
      await this.jwtHelper.verifyRefresh(refreshToken);
    this.jwtHelper.revoke(payload.sub, refreshToken);
    return { suuccess: true };
  }

  async forgetPassword(email: string) {
    const user = this.usersByEmail.get(email);
    if (user) {
      const { accessToken: resetToken } =
        await this.jwtHelper.issueTokenPair(user.id, email);
      return { message: 'reset link sent', resetToken };
    }
    return {
      message: 'if that email exicts a rese link has been sent',
    };
  }
}
