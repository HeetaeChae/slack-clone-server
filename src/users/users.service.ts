import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { ChannelChat } from 'src/entities/ChannelChat.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    if (!user) {
      throw new UnauthorizedException('이메일이 존재하지 않습니다.');
    }
    return user;
  }

  // 회원가입
  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await queryRunner.manager
      .getRepository(User)
      .findOne({ where: { email } });
    if (user) {
      throw new HttpException('이미 존재하는 이메일입니다.', 403);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      // 유저 생성
      const user = queryRunner.manager.getRepository(User).create();
      user.email = email;
      user.password = hashedPassword;
      user.nickname = nickname;
      const userRes = await queryRunner.manager.getRepository(User).save(user);
      // 워크스페이스 생성
      const workspace = queryRunner.manager.getRepository(Workspace).create();
      workspace.owner = userRes;
      workspace.name = `${nickname}의 워크스페이스`;
      workspace.url = `${nickname}_workspace`;
      const workspaceRes = await queryRunner.manager
        .getRepository(Workspace)
        .save(workspace);
      // 워크스페이스 멤버 생성
      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMember)
        .create();
      workspaceMember.user = userRes;
      workspaceMember.workspace = workspaceRes;
      await queryRunner.manager
        .getRepository(WorkspaceMember)
        .save(workspaceMember);
      // 채널 생성
      const channel = queryRunner.manager.getRepository(Channel).create();
      channel.workspace = workspaceRes;
      channel.name = `${nickname}의 채널`;
      const channelRes = await queryRunner.manager
        .getRepository(Channel)
        .save(channel);
      // 채널 멤버 생성
      const channelMember = queryRunner.manager
        .getRepository(ChannelMember)
        .create();
      channelMember.channel = channelRes;
      channelMember.user = userRes;
      await queryRunner.manager
        .getRepository(ChannelMember)
        .save(channelMember);
      // 채팅 생성
      const channelChat = queryRunner.manager
        .getRepository(ChannelChat)
        .create();
      channelChat.channel = channelRes;
      channelChat.user = userRes;
      channelChat.content = `${nickname}님, 환영합니다.`;
      await queryRunner.manager.getRepository(ChannelChat).save(channelChat);
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
