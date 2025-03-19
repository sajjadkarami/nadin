import { IsString } from 'class-validator';
import { PasswordDto } from './password.dto';

export class LoginDto extends PasswordDto {
  @IsString()
  userName: string;
}
