import { PickType } from '@nestjs/swagger';
import { JoinRequestDto } from './join.request.dto';

export class LoginRequestDto extends PickType(JoinRequestDto, [
  'email',
  'password',
]) {}
