import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards/at.guard';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

import { ArgumentsHost, Catch, ExceptionFilter, Module, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express'

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AtGuard,
  }],
})
export class AppModule {}
