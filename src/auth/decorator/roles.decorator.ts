/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Role } from '../dto/role.enum';
import { UserDto } from '../../users/dto/user.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const UserEntity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const user: UserDto = ctx.switchToHttp().getRequest().user;
    const { createdAt, updatedAt, ...returnUser } = user;
    return returnUser;
  },
);
