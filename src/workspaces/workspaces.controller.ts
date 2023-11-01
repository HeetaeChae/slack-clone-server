import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/User.entity';
import { CreateWorkspaceMemberDto } from './dto/create-workspace-member.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACES')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @ApiOperation({
    summary: '유저 id로 워크스페이스 가져오기 (워크스페이스 가져오기 기능)',
  })
  @Get()
  async getMyWorkspaces(@GetUser() user: User) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 워크스페이스 name, 유저 id로 워크스페이스 생성하기 (워크스페이스 생성하기 기능)',
  })
  @Post()
  async createWorkspace(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @GetUser() user: User,
  ) {
    return this.workspacesService.createWorkspace(
      createWorkspaceDto.url,
      createWorkspaceDto.name,
      user.id,
    );
  }

  @ApiOperation({
    summary:
      '워크스페이스 url로 워크스페이스 멤버 가져오기 (워크스페이스 멤버 가져오기 기능)',
  })
  @Get(':url/members')
  async getWorkspaceMembers(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 유저 email로 워크스페이스 멤버 초대하기 (워크스페이스 멤버 초대하기 기능)',
  })
  @Post('members')
  async createWorkspaceMembers(
    @Body() createWorkspaceMemberDto: CreateWorkspaceMemberDto,
    @Body('email') email: string,
  ) {
    return this.workspacesService.createWorkspaceMembers(
      createWorkspaceMemberDto.url,
      email,
    );
  }

  @ApiOperation({
    summary:
      '워크스페이스 url, 유저 id로 워크스페이스 멤버 가져오기 (워크스페이스 멤버 가져오기 기능)',
  })
  @Get(':url/members/:id')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
