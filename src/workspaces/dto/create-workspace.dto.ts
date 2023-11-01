import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: '개발자워크스페이스1',
    description: '워크스페이스명',
  })
  @MinLength(1)
  @MaxLength(20)
  @IsString()
  name: string;

  @ApiProperty({
    example: 'developer_channel_1',
    description: '워크스페이스url',
  })
  @MinLength(1)
  @MaxLength(20)
  @IsString()
  url: string;
}
