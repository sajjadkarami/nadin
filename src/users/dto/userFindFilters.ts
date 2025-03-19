import { ApiProperty, PickType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseFindFilters } from '../../common/dto/baseFindFilters.dto';
import { UserOrder } from './userOrder.dto';

export class UserFindFilter extends PickType(BaseFindFilters, [
  'order',
  'page',
  'take',
]) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ enumName: 'role', enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ enumName: 'orderBy', enum: UserOrder, required: false })
  @IsEnum(UserOrder)
  @IsOptional()
  orderBy?: UserOrder;
}
