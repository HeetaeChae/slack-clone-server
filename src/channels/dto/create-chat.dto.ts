import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @ApiProperty({ example: '안녕하세요, 반갑습니다.', description: '채팅 내용' })
  content: string;
}
