import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string,
  email: string,
}

export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExperation: false,
      secretOrKey: process.env.AT_JWT_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}