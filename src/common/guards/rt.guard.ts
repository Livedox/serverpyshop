import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}