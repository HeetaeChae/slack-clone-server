import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto } from 'src/users/dto/login.request.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginRequestDto: LoginRequestDto) {
    return this.authService.login(
      loginRequestDto.email,
      loginRequestDto.password,
    );
  }
}
