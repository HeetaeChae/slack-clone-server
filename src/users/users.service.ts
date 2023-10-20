import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(email): Promise<any> {
    const found = this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    return found;
  }
}
