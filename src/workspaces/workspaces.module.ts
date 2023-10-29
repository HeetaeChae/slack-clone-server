import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/entities/Workspace.entity';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { User } from 'src/entities/User.entity';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  imports: [
    TypeOrmModule.forFeature([
      Workspace,
      WorkspaceMember,
      Channel,
      ChannelMember,
      User,
    ]),
  ],
})
export class WorkspacesModule {}
