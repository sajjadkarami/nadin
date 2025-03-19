import { IsEnum } from 'class-validator';
import { Role } from '../../auth/dto/role.enum';

export class UpdateRoleDto {
  @IsEnum(Role)
  role: Role;
}
