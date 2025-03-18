import { IsString } from 'class-validator';
import { PasswordDto } from './password.dto';

export class SignUpWithUserNameDto extends PasswordDto {
  @IsString()
  userName: string;
}
