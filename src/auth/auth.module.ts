import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.SECRET_KEY }),
    UsersModule,
  ],
})
export class AuthModule {}
