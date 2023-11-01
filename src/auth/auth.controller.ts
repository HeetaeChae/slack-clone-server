import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from 'src/users/dto/login.request.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoggedInGuard } from './logged-in.guard';
import { NotLoggedInGuard } from './not-logged-in.guard';

@ApiTags('AUTH')
@ApiBearerAuth('jwt')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '로그인 기능',
  })
  @Post('login')
  async logIn(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.logIn(
      loginRequestDto.email,
      loginRequestDto.password,
    );
  }

  @ApiOperation({ summary: '로그아웃 기능' })
  @UseGuards(AuthGuard)
  @Post('logout')
  async logOut(@Request() req, @Response() res) {
    req.user = null;
    localStorage.removeItem('access_token');
    return res.send('로그아웃 했습니다.');
  }
}
