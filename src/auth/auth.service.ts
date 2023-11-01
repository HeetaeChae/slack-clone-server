import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    // 로그인 정보 검증
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      throw new UnauthorizedException('패스워드를 다시 입력해주세요.');
    }
    // 토큰 발행
    const payload = { id: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
