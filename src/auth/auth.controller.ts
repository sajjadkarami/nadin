import { Body, Controller, Post } from '@nestjs/common';
import { SignUpWithUserNameDto } from './dto/signUp-userName.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('SignUpWithUserName')
  signUpWithUserName(@Body() dto: SignUpWithUserNameDto) {
    return this.authService.signUpWithUserName(dto);
  }

  @Post('LoginWIthUserName')
  loginWithUserName(@Body() dto: SignUpWithUserNameDto) {
    return this.authService.loginWithUserName(dto);
  }
}
