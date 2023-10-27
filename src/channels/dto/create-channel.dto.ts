import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChannelDto {
  @MinLength(2)
  @MaxLength(10)
  @IsString()
  @ApiProperty({
    example: '개발자채널1',
    description: '채널명',
  })
  name: string;
}
