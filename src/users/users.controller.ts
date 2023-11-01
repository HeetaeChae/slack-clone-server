import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/User.entity';
import { DataSource } from 'typeorm';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiBearerAuth('jwt')
@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private usersServie: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() joinRequestDto: JoinRequestDto) {
    const result = await this.usersServie.join(
      joinRequestDto.email,
      joinRequestDto.nickname,
      joinRequestDto.password,
    );
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({ summary: '프로필 가져오기' })
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: User) {
    return user || false;
  }
}
