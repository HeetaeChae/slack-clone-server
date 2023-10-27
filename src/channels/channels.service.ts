import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelChat } from 'src/entities/ChannelChat.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { User } from 'src/entities/User.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { Repository } from 'typeorm';

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
  ) {}

  // 채널 id로 특정 채널 가져오기
  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }
  // 워크스페이스 url, 유저 id로 채널 가져오기
  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect('channels.channelMembers', 'channelMembers')
      .innerJoinAndSelect('channels.workspace', 'workspace')
      .where('channelMembers.userId = :myId', { myId })
      .andWhere('workspace.url = :url', { url })
      .getMany();
  }
  // 워크스페이스 url, 채널 name으로 유저 가져오기
  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.channelMembers', 'channelMembers')
      .innerJoin('channelMembers.channel', 'channel')
      .innerJoin('channels.workspace', 'workspace')
      .where('channels.name = :name', { name })
      .andWhere('workspaces.url = :url', { url })
      .getMany();
  }
  // 워크스페이스 url, 채널 name으로 채널채팅 가져오기
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
}
