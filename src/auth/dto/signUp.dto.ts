import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { PasswordDto } from './password.dto';

export class SignUpDto extends PasswordDto {
  @IsString()
  userName: string;

  @IsPhoneNumber('IR')
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
