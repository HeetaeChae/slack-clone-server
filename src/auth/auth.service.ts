import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email, password): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('이메일을 다시 입력해주세요.');
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const payload = { email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('비밀번호를 다시 입력해주세요.');
    }
  }
}
