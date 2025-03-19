import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { Public } from '../common/decorator/public.decorator';
import { JwtDto } from './dto/Jwt.dto';

@ApiBearerAuth('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('singUp')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          example: 'admin',
        },
        password: {
          type: 'string',
          example: 'Password1234',
        },
      },
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: { user: JwtDto }) {
    return this.authService.login(req.user.userId);
  }
}
