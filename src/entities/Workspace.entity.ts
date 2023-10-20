import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from './Channel.entity';
import { Dm } from './Dm.entity';
import { Mention } from './Mention.entity';
import { User } from './User.entity';
import { WorkspaceMember } from './WorkspaceMember.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deteledAt: Date | null;

  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.workspace,
  )
  workspaceMembers: WorkspaceMember[];

  @ManyToOne(() => User, (user) => user.workspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  owner: User;

  @OneToMany(() => Channel, (channel) => channel.workspace)
  channels: Channel[];

  @OneToMany(() => Dm, (dm) => dm.workspace)
  dms: Dm[];

  @OneToMany(() => Mention, (mention) => mention.workspace)
  mentions: Mention[];
}
