import { PickType } from '@nestjs/swagger';
import { CreateWorkspaceDto } from './create-workspace.dto';

export class CreateWorkspaceMemberDto extends PickType(CreateWorkspaceDto, [
  'url',
]) {}
