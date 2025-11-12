import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStartegy extends PassportStrategy(
  Strategy,
) {
  constructor() {
    super({
      secretOrKey: '1234qwer',
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: any) {
    return payload;
  }
}
