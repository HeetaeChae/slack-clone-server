import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dm } from 'src/entities/Dm.entity';
import { User } from 'src/entities/User.entity';
import { Workspace } from 'src/entities/Workspace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Dm) private dmsRepository: Repository<Dm>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
  ) {}

  async getWorkspaceDms(url: string, myId: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.dms', 'dms')
      .innerJoin('user.workspaceMember', 'workpsaceMember')
      .innerJoin('workspaceMember.workspace', 'workspace')
      .where('workspace.url = :url', { url })
      .andWhere('user.id = :id', { id: myId });
  }
}
