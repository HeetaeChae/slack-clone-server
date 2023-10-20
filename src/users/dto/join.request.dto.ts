import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class JoinRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    example: 'email@gmail.com',
    description: '이메일',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    example: '123123',
    description: '비밀번호',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    example: 'nickname123',
    description: '닉네임',
  })
  nickname: string;
}
