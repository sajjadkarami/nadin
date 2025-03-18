import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HashService } from '../utils/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}
  async create({
    email,
    password,
    phoneNumber,
    userName,
  }: CreateUserDto): Promise<UserDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }, { userName }],
      },
    });
    if (user) throw new BadRequestException('User Already exists');
    const hashedPassword = await this.hashService.hash(password);
    const createdUser = await this.prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        phoneNumber,
        role: 'USER',
        profile: {
          create: {},
        },
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
    return createdUser;
  }

  findOneById(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      omit: {
        refreshToken: true,
        password: true,
      },
    });
  }
  findOneByUserName(value: string) {
    return this.prisma.user.findFirst({
      where: {
        userName: value,
      },
    });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  findOneByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });
  }
}
