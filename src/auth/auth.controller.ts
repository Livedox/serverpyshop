import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AccessToken, Tokens } from './types';
import { RtGuard } from 'src/common/guards/rt.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('local/register')
  @HttpCode(HttpStatus.CREATED)
  registerLocal(
    @Body() dto: AuthDto,
    @Res({passthrough: true}) res: Response,  
  ): Promise<AccessToken> {
    return this.authService.registerLocal(res, dto);
  }

  @Public()
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  loginLocal(
    @Body() dto: AuthDto,
    @Res({passthrough: true}) res: Response,  
  ): Promise<AccessToken> {
    return this.authService.loginLocal(res, dto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
    @Res({passthrough: true}) res: Response
  ) {
    return this.authService.logout(res, userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: number,
    @Res({passthrough: true}) res: Response,
  ): Promise<AccessToken> {
    return this.authService.refreshTokens(res, userId, refreshToken);
  }
}

