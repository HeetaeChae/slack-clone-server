import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelChat } from 'src/entities/ChannelChat.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { User } from 'src/entities/User.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel) private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelMember)
    private channelMembersRepository: Repository<ChannelMember>,
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
    @InjectRepository(ChannelChat)
    private channelChatsRespository: Repository<ChannelChat>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  // 채널 id로 특정 채널 가져오기 (채널 가져오기 기능)
  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }
  // 워크스페이스 url, 유저 id로 채널 가져오기 (채널 가져오기 기능)
  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect('channels.channelMembers', 'channelMembers')
      .innerJoinAndSelect('channels.workspace', 'workspace')
      .where('channelMembers.userId = :myId', { myId })
      .andWhere('workspace.url = :url', { url })
      .getMany();
  }
  // 워크스페이스 url, 채널 name으로 채널 가져오기 (채널 가져오기 기능)
  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace')
      .where('channel.name = :name', { name })
      .andWhere('workspace.url =:url', { url })
      .getOne();
  }
  // 워크스페이스 url, 채널 name, 유저 id로 채널 생성하기 (채널 생성 기능)
  async createWorkspaceChannel(url: string, name: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const workspace = await queryRunner.manager
      .getRepository(Workspace)
      .findOne({ where: { url } });
    if (!workspace) {
      throw new HttpException('워크스페이스를 찾을 수 없습니다.', 403);
    }
    const user = await queryRunner.manager
      .getRepository(User)
      .findOne({ where: { id: myId } });
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다.', 403);
    }
    try {
      // 채널 생성
      const channel = await queryRunner.manager.getRepository(Channel).create();
      channel.name = name;
      channel.workspace = workspace;
      const channelRes = await queryRunner.manager
        .getRepository(Channel)
        .save(channel);
      // 채널멤버 생성
      const channelMember = await queryRunner.manager
        .getRepository(ChannelMember)
        .create();
      channelMember.channel = channelRes;
      channelMember.user = user;
      await queryRunner.manager
        .getRepository(ChannelMember)
        .save(channelMember);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.commitTransaction();
    }
  }
  // 워크스페이스 url, 채널 name으로 유저 가져오기 (유저 가져오기 기능)
  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.channelMembers', 'channelMembers')
      .innerJoin('channelMembers.channel', 'channel')
      .innerJoin('channel.workspace', 'workspace')
      .where('channel.name = :name', { name })
      .andWhere('workspace.url = :url', { url })
      .getMany();
  }
  // 워크스페이스 url, 채널 name, 유저 email로 채널 멤버 생성하기 (채널 가입 기능)
  async createWorkspaceChannelMember(url: string, name: string, email: string) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace')
      .where('channel.name = :name', { name })
      .andWhere('workspace.url = :url', { url })
      .getOne();
    if (!channel) {
      throw new HttpException('채널을 찾을 수 없습니다.', 403);
    }

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.workspaces', 'workspace')
      .where('user.email = :email', { email })
      .andWhere('workspace.url = :url', { url })
      .getOne();
    console.log(user);
    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다.', 403);
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const channelMember = queryRunner.manager
        .getRepository(ChannelMember)
        .create();
      channelMember.channel = channel;
      channelMember.user = user;
      await queryRunner.manager
        .getRepository(ChannelMember)
        .save(channelMember);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.commitTransaction();
    }
  }
  // 워크스페이스 url, 채널 name으로 채널채팅 가져오기 (채널채팅 가져오기 기능)
  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRespository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.channel', 'channel')
      .innerJoin('channel.workspace', 'workspace')
      .where('channel.name = :name', { name })
      .andWhere('workspace.url = :url', { url })
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }
  /*
  // 워크스페이스 url, 채널 name, 채널채팅 content, 유저 id로 채팅 생성하기 (채널채팅 생성하기 기능)
  async createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    myId: number,
  ) {}
  // 워크스페이스 url, 채널 name, 날짜 정보로 안읽은 채널 개수 가져오기 (채널개수 가져오기 기능)
  async getChannelUnreadsCount(url, name, after) {}
  */

  // 워크스페이스 url, 채널 name, file, 유저 id로 채널 이미지 생성하기 (채널이미지 생성하기 기능)
  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    myId: number,
  ) {
    console.log(url, name, files, myId);
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace')
      .where('channel.name = :name')
      .andWhere('workspace.url = :url')
      .getOne();

    console.log(channel);
  }
}
