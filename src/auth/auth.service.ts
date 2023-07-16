import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { AccessToken, Tokens } from './types';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registerLocal(res: Response, dto: AuthDto): Promise<AccessToken> {
    const user = await this.prisma.user.findUnique({
      where: {email: dto.email},
    });
    if (user) throw new ForbiddenException('User already exists');

    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash
      }
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRTHash(newUser.id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, sameSite: 'none', secure: false});
    return {
      accessToken: tokens.accessToken,
    };
  }

  async loginLocal(res: Response, dto: AuthDto): Promise<AccessToken> {
    const user = await this.prisma.user.findUnique({
      where: {email: dto.email},
    });

    if (!user) throw new NotFoundException('User not found');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Password incorrect');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRTHash(user.id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, sameSite: 'none', secure: false});
    return {
      accessToken: tokens.accessToken
    };
  }

  async logout(res: Response, userId: number) {
    res.cookie('refreshToken', '', {httpOnly: true, sameSite: 'none', secure: false});
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        }
      },
      data: {
        refreshToken: null,
      }
    });
  }

  async refreshTokens(res: Response, userId: number, rt: string): Promise<AccessToken> {
    const user = await this.prisma.user.findUnique({
      where: {id: userId},
    });
    if (!user) throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRTHash(user.id, tokens.refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, sameSite: 'none', secure: false});
    return {
      accessToken: tokens.accessToken,
    };
  }

  private async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        email,
      }, {
        secret: process.env.AT_JWT_SECRET,
        expiresIn: 60 * 30,
      }),
      this.jwtService.signAsync({
        sub: userId,
        email,
      }, {
        secret: process.env.RT_JWT_SECRET,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    }
  }

  private async updateRTHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {id: userId},
      data: {refreshToken: hash}
    })
  }
}
