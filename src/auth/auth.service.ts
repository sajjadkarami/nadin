import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { HashService } from '../utils/hash.service';
import { SignUpDto } from './dto/signUp.dto';
import { Token } from './model/token.model';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async signUp({ userName, password }: SignUpDto): Promise<Token> {
    const user = await this.userService.create({ userName, password });
    return this.login(user.id);
  }

  async login(id: number) {
    const user = await this.userService.findOneById(id);
    if (!user) throw new BadRequestException('User not found');

    return this.generateTokens({ userId: id, role: user.role });
  }

  async validateUser(userName: string, password: string): Promise<UserDto> {
    const user = await this.userService.findOneByUserName(userName);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }
  private generateTokens(payload: { userId: number; role: Role }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
  }
}
