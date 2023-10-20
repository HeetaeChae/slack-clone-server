import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChat } from './ChannelChat.entity';
import { ChannelMember } from './ChannelMember.entity';
import { Dm } from './Dm.entity';
import { Mention } from './Mention.entity';
import { Workspace } from './Workspace.entity';
import { WorkspaceMember } from './WorkspaceMember.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  nickname: string;

  @Column('varchar')
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  workspaces: Workspace[];

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
  workspaceMembers: WorkspaceMember[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.user)
  channelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.user)
  channelChats: ChannelChat[];

  @OneToMany(() => Mention, (mention) => mention.sender)
  senderMentions: Mention[];

  @OneToMany(() => Mention, (mention) => mention.receiver)
  receiverMentions: Mention[];

  @OneToMany(() => Dm, (dm) => dm.sender)
  senderDms: Dm[];

  @OneToMany(() => Dm, (dm) => dm.receiver)
  receiverDms: Dm[];
}
