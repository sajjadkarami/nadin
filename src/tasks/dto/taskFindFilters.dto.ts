import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Order } from '../../common/dto/order.enum';
import { Type } from 'class-transformer';
import { TaskOrderBy } from './taskOrderBy.enum';

export class TaskFindFilter {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskOrderBy })
  @IsOptional()
  @IsEnum(TaskOrderBy)
  orderBy?: TaskOrderBy;

  @ApiPropertyOptional({ enum: Order })
  @IsOptional()
  @IsEnum(Order)
  order?: Order;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;
}
