import { CategoryEnum } from 'src/common/enums/category.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChat } from './ChannelChat.entity';
import { User } from './User.entity';
import { Workspace } from './Workspace.entity';

@Entity()
export class Mention {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum')
  category: CategoryEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => ChannelChat, (channelChat) => channelChat.mentions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  chat: ChannelChat;

  @ManyToOne(() => Workspace, (workspace) => workspace.mentions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  workspace: Workspace;

  @ManyToOne(() => User, (user) => user.senderMentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  sender: User;

  @ManyToOne(() => User, (user) => user.receiverMentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  receiver: User;
}
