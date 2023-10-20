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
import { ChannelChat } from './ChannelChat.entity';
import { ChannelMember } from './ChannelMember.entity';
import { Workspace } from './Workspace.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('tinyint', { width: 1, default: () => 0 })
  private: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  detetedAt: Date | null;

  @OneToMany(() => ChannelMember, (channelMembers) => channelMembers.channel)
  channelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.channel)
  channelChats: ChannelChat[];

  @ManyToOne(() => Workspace, (workspace) => workspace.channels)
  @JoinColumn()
  workspace: Workspace;
}
