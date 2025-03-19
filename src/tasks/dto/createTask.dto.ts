import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;
}
