import { IsStrongPassword } from 'class-validator';

export class PasswordDto {
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 0,
    minSymbols: 0,
  })
  password: string;
}
