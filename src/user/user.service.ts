import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async updateUser(userId: number, dto: UserDto): Promise<UserDto> {
    const user = await this.prisma.user.update({
      where: {id: userId},
      data: {
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        personalInformation: dto.personalInformation,
      }
    });

    return {
      name: user.name,
      phone: user.phone,
      address: user.address,
      personalInformation: user.personalInformation,
    }
  }

  async getUser(userId: number): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({where: {id: userId}});

    return {
      name: user.name,
      phone: user.phone,
      address: user.address,
      personalInformation: user.personalInformation,
    }
  }
}
