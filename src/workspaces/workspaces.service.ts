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

  // 워크스페이스 id로 특정 워크스페이스 가져오기 (워크스페이스 가져오기 기능)
  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  // 유저 id로 워크스페이스 가져오기 (워크스페이스 가져오기 기능)
  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository
      .createQueryBuilder('workspaces')
      .innerJoin('workspaces.workspaceMembers', 'workspaceMembers')
      .where('workspaceMembers.userId = :userId', { userId: myId })
      .getMany();
  }

  // 워크스페이스 url, 워크스페이스 name, 유저 id로 워크스페이스 생성하기 (워크스페이스 생성하기 기능)
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

  // 워크스페이스 url로 워크스페이스 멤버 가져오기 (워크스페이스 멤버 가져오기 기능)
  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.workspaceMembers', 'workspaceMembers')
      .innerJoin('workspaceMembers.workspace', 'workspace')
      .where('workspace.url = :url', { url })
      .getMany();
  }

  // 워크스페이스 url, 유저 email로 워크스페이스 멤버 초대하기 (워크스페이스 멤버 초대하기 기능)
  async createWorkspaceMembers(url: string, email: string) {
    const workspace = await this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoinAndSelect('workspace.channels', 'channels')
      .where('workspace.url = :url', { url })
      .getOne();
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!workspace) {
      throw new HttpException('워크스페이스를 찾을 수 없습니다.', 400);
    }
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다.', 400);
    }

    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const workspaceMember = await queryRunner.manager
        .getRepository(WorkspaceMember)
        .create();
      workspaceMember.user = user;
      workspaceMember.workspace = workspace;
      await queryRunner.manager
        .getRepository(WorkspaceMember)
        .save(workspaceMember);
      const channelMember = await queryRunner.manager
        .getRepository(ChannelMember)
        .create();
      channelMember.user = user;
      channelMember.channel = workspace.channels.find((v) => v.name === '일반');
      await queryRunner.manager
        .getRepository(ChannelMember)
        .save(channelMember);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.commitTransaction();
    }
  }

  // 워크스페이스 url, 유저 id로 워크스페이스 멤버 가져오기 (워크스페이스 멤버 가져오기 기능)
  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.workspaceMembers', 'workspaceMembers')
      .innerJoin('workspaceMembers.workspace', 'workspace')
      .where('workspace.url = :url', { url })
      .andWhere('user.id =:id', { id })
      .getOne();
  }
}
