import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordDto } from '../../auth/dto/password.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends PasswordDto {
  @ApiProperty({
    example: 'sajjadkarami74@gmail.com',
    description: 'email of the user',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(3)
  @MaxLength(50)
  @IsString()
  @IsOptional()
  userName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;
}
