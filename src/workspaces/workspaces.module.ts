import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/entities/Workspace.entity';
import { WorkspaceMember } from 'src/entities/WorkspaceMember.entity';
import { Channel } from 'src/entities/Channel.entity';
import { ChannelMember } from 'src/entities/ChannelMember.entity';
import { User } from 'src/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  imports: [
    ConfigModule.forRoot(),
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
