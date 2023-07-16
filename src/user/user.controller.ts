import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateUser(@GetCurrentUserId() userId: number, @Body() dto: UserDto): Promise<UserDto> {
    return this.userService.updateUser(userId, dto);
  }

  @Post('get')
  @HttpCode(HttpStatus.OK)
  getUser(@GetCurrentUserId() userId: number): Promise<UserDto> {
    return this.userService.getUser(userId);
  }
}
