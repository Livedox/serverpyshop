import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

type JwtPayload = {
  sub: string,
  email: string,
}

export const cookieExtractor = (request: Request): string | null => {
  let token = null;
  if (request && request.signedCookies) {
    token = request.cookies['refreshToken'];
  }
  return token;
};

export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.RT_JWT_SECRET,
      ignoreExperation: false,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies['refreshToken'];
    return {
      ...payload,
      refreshToken,
    };
  }
}