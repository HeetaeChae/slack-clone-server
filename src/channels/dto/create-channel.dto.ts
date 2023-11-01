import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @ApiProperty({
    example: '개발자채널1',
    description: '채널명',
  })
  name: string;
}
