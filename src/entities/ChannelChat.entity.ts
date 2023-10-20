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
import { Mention } from './Mention.entity';
import { User } from './User.entity';

@Entity()
export class ChannelChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Mention, (mention) => mention.chat)
  mentions: Mention[];

  @ManyToOne(() => Channel, (channel) => channel.channelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  channel: Channel;

  @ManyToOne(() => User, (user) => user.channelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
