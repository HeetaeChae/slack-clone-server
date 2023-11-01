import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/User.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer.options';

@ApiTags('CHANNEL')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
@Controller('workspaces')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @ApiOperation({
    summary: '워크스페이스 url, 유저 id로 채널 가져오기 (채널 가져오기 기능)',
  })
  @Get(':url/channels')
  getWorkspaceChannels(@Param('url') url: string, @GetUser() user: User) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 채널 name으로 채널 가져오기 (채널 가져오기 기능)',
  })
  @Get(':url/channels/:name')
  getWorkspaceChannel(@Param('url') url: string, @Param('name') name: string) {
    console.log(url, name);
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 채널 name, 유저 id로 채널 생성하기 (채널 생성 기능)',
  })
  @Post(':url/channels')
  createWorkspaceChannel(
    @Param('url') url: string,
    @Body() createChannelDto: CreateChannelDto,
    @GetUser() user: User,
  ) {
    return this.channelsService.createWorkspaceChannel(
      url,
      createChannelDto.name,
      user.id,
    );
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 채널 name으로 유저 가져오기 (유저 가져오기 기능)',
  })
  @Get(':url/channels/:name/members')
  getWorkspaceChannelMembers(
    @Param('url') url: string,
    @Param('name') name: string,
  ) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 채널 name, 유저 email로 채널 멤버 초대하기 (채널 초대 기능)',
  })
  @Post(':url/channels/:name/members')
  createWorkspaceChannelMember(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('email') email: string,
  ) {
    return this.channelsService.createWorkspaceChannelMember(url, name, email);
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 채널 name으로 채널채팅 가져오기 (채널채팅 가져오기 기능)',
  })
  @Get(':url/channels/:name/chats')
  getWorkspaceChannelChats(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body('perPage', ParseIntPipe) perPage: number,
    @Body('page', ParseIntPipe) page: number,
  ) {
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      perPage,
      page,
    );
  }

  /*
  @ApiOperation({
    summary:
      '워크스페이스 url, 채널 name, 채널채팅 content, 유저 id로 채팅 생성하기 (채널채팅 생성하기 기능)',
  })
  @Post(':url/channels/:name/chats')
  createWorkspaceChannelChats(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() createChatDto: CreateChatDto,
    @GetUser() user: User,
  ) {
    return this.channelsService.createWorkspaceChannelChat(
      url,
      name,
      createChatDto.content,
      user.id,
    );
  }
  */

  @ApiOperation({
    summary: '워크스페이스 특정채널 이미지 업로드하기 (이미지 업로드 기능)',
  })
  @UseInterceptors(FilesInterceptor('image', 10, multerOptions()))
  @Post(':url/channels/:name/images')
  async createWorkspaceChannelImages(
    @Param('url') url: string,
    @Param('name') name,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
  ) {
    return this.channelsService.createWorkspaceChannelImages(
      url,
      name,
      files,
      user.id,
    );
  }
}
