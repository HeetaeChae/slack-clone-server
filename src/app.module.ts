import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddlewares } from './common/middlewares/logger.middlewares';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Workspace } from './entities/Workspace.entity';
import { WorkspaceMember } from './entities/WorkspaceMember.entity';
import { Channel } from './entities/Channel.entity';
import { ChannelChat } from './entities/ChannelChat.entity';
import { ChannelMember } from './entities/ChannelMember.entity';
import { Dm } from './entities/Dm.entity';
import { Mention } from './entities/Mention.entity';
import { ChannelsModule } from './channels/channels.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { DmsModule } from './dms/dms.module';
import { MulterModule } from '@nestjs/platform-express';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_1,
      port: 3306,
      username: process.env.USERNAME_1,
      password: process.env.PASSWORD_1,
      database: process.env.DATABASE_1,
      entities: [
        User,
        Workspace,
        WorkspaceMember,
        Channel,
        ChannelChat,
        ChannelMember,
        Dm,
        Mention,
      ],
      charset: 'utf8mb4_general_ci',
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Workspace,
      WorkspaceMember,
      Channel,
      ChannelChat,
      ChannelMember,
      Dm,
      Mention,
    ]),
    UsersModule,
    AuthModule,
    ChannelsModule,
    WorkspacesModule,
    DmsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddlewares).forRoutes('*');
  }
}
