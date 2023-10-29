import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { User } from 'src/entities/User.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember)
    private workspaceMembersRepository: Repository<WorkspaceMember>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMembersRepository: Repository<ChannelMember>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findWorkspaces(myId: number) {
    return this.workspacesRepository
      .createQueryBuilder('workspaces')
      .innerJoin('workspaces.workspaceMembers', 'workspaceMembers')
      .where('workspaceMembers.userId = :userId', { userId: myId })
      .getMany();
  }

  async createWorkspace(url: string, name: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = await this.usersRepository.findOne({ where: { id: myId } });
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다.', 403);
    }
    try {
      // 워크스페이스 생성
      const workspace = await queryRunner.manager
        .getRepository(Workspace)
        .create();
      workspace.url = url;
      workspace.name = name;
      workspace.owner = user;
      const workspaceRes = await queryRunner.manager
        .getRepository(Workspace)
        .save(workspace);
      // 워크스페이스 멤버 생성
      const workspaceMember = await queryRunner.manager
        .getRepository(WorkspaceMember)
        .create();
      workspaceMember.user = user;
      workspaceMember.workspace = workspaceRes;
      await queryRunner.manager
        .getRepository(WorkspaceMember)
        .save(workspaceMember);
      // 채널 생성
      const channel = await queryRunner.manager.getRepository(Channel).create();
      channel.name = '일반';
      channel.workspace = workspaceRes;
      const channelRes = await queryRunner.manager
        .getRepository(Channel)
        .save(channel);
      // 채널 멤버 생성
      const channelMember = await queryRunner.manager
        .getRepository(ChannelMember)
        .create();
      channelMember.user = await user;
      channelMember.channel = await channelRes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.commitTransaction();
    }
  }
}
