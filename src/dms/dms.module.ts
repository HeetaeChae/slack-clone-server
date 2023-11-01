import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dm } from 'src/entities/Dm.entity';
import { User } from 'src/entities/User.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { DmsController } from './dms.controller';
import { DmsService } from './dms.service';

@Module({
  controllers: [DmsController],
  providers: [DmsService],
  imports: [TypeOrmModule.forFeature([Dm, User, Workspace])],
})
export class DmsModule {}
