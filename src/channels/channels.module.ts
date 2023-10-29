import { Module } from '@nestjs/common';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { User } from 'src/entities/User.entity';
import { ChannelChat } from 'src/entities/ChannelChat.entity';
import { Workspace } from 'src/entities/Workspace.entity';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ChannelMember,
      User,
      ChannelChat,
      Workspace,
    ]),
  ],
})
export class ChannelsModule {}
