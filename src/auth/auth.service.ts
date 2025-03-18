import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpWithUserNameDto } from './dto/signUp-userName.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from './model/token.model';
import { HashService } from '../utils/hash.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}
  async signUpWithUserName({
    userName,
    password,
  }: SignUpWithUserNameDto): Promise<Token> {
    const user = await this.userService.create({ userName, password });
    return this.generateTokens({ userId: user.id });
  }
  async loginWithUserName({ userName, password }: SignUpWithUserNameDto) {
    const user = await this.userService.findOneByUserName(userName);
    if (user) {
      const isPasswordCorrect = await this.hashService.compare(
        password,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedException('username or password is invalid');
      }
      return this.generateTokens({ userId: user.id });
    }
    throw new UnauthorizedException('username or password is invalid');
  }

  async validateUser(id): Promise<UserDto> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
  private generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
  }
}
