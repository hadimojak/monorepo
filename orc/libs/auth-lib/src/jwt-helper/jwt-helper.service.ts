import {
  Global,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtOptionsFactory } from '@nestjs/jwt';
import type { UUID } from 'crypto';

export type JwtPayload = { sub: UUID; email: string };

export const ACCESS_TOKEN_TTL =
  Number(process.env.ACCESS_TOKEN_TTL) ?? 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL =
  Number(process.env.REFRESH_TOKEN_TTL) ??
  7 * 24 * 60 * 60 * 1000;
export const ACCESS_TOKEN_SECRET =
  <string>process.env.ACCESS_TOKEN_SECRET ?? 'dev_access_secret';
export const REFRESH_TOKEN_SECRET =
  <string>process.env.REFRESH_TOKEN_SECRET ??
  'dev_refresh_secret';

@Injectable()
export class jwtHelperService {
  constructor(private readonly jwtService: JwtService) {}

  private store = new Map<UUID, Set<string>>();

  add(userId: UUID, token: string) {
    const set = this.store.get(userId) ?? new Set<string>();
    set.add(token);
    this.store.set(userId, set);
  }

  has(userId: UUID, token: string) {
    return this.store.get(userId)?.has(token) ?? false;
  }

  revoke(userId: UUID, token: string) {
    this.store.get(userId)?.delete(token);
  }

  revokeAll(userId: UUID) {
    this.store.delete(userId);
  }

  async signAccess(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_TTL,
    });
  }

  async signRefresh(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_TTL,
    });
  }

  async verifyRefresh(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          secret: REFRESH_TOKEN_SECRET,
        },
      );
    } catch {
      throw new UnauthorizedException(
        'invalid or expired refresh roken',
      );
    }
  }

  async issueTokenPair(
    userId: UUID,
    email: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: Date; // access token TTL (string form)
    payload: JwtPayload;
  }> {
    const payload: JwtPayload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccess(payload),
      this.signRefresh(payload),
    ]);
    return {
      accessToken,
      refreshToken,
      expiresIn: new Date(Date.now() + ACCESS_TOKEN_TTL),
      payload,
    };
  }
}
