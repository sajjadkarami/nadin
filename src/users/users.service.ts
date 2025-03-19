/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HashService } from '../utils/hash.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserDto } from './dto/user.dto';
import { UserFindFilter } from './dto/userFindFilters';
import { Order } from '../common/dto/order.enum';
import { UserOrder } from './dto/userOrder.dto';
import { UserList } from './dto/userList.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Role } from '../auth/dto/role.enum';
import { UpdateProfileDto } from './dto/updateProfile.dto';
@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}
  private convertOrder(orderBy: UserOrder, order: Order) {
    switch (orderBy) {
      case UserOrder.id:
        return { id: order ? order : Order.ASC };
      case UserOrder.email:
        return { email: order ? order : Order.ASC };
      case UserOrder.phoneNumber:
        return { phoneNumber: order ? order : Order.ASC };
      case UserOrder.userName:
        return { userName: order ? order : Order.ASC };
      case UserOrder.role:
        return { role: order ? order : Order.ASC };
      case UserOrder.createdAt:
        return { createdAt: order ? order : Order.ASC };
      case UserOrder.updatedAt:
        return { updatedAt: order ? order : Order.ASC };
      default:
        return { id: Order.ASC };
    }
  }
  async findAll({
    order,
    orderBy,
    email,
    page,
    phoneNumber,
    role,
    take,
    userName,
  }: UserFindFilter): Promise<UserList> {
    let orderResult;
    if (order && orderBy) orderResult = this.convertOrder(orderBy, order);
    const where = {
      AND: [
        {
          userName: { contains: userName },
          email: { contains: email },
          phoneNumber: { contains: phoneNumber },
          role: role,
        },
      ],
    };
    const skip = ((page ?? 1) - 1) * (take ?? 10);

    const total = await this.prisma.user.count({ where });
    const pages = Math.ceil(total / (take ?? 10));
    const users = await this.prisma.user.findMany({
      orderBy: orderResult,
      take,
      skip,
      where,
      omit: {
        refreshToken: true,
        password: true,
      },
    });
    return {
      data: users,
      page: page ?? 1,
      pages,
      hasNextPage: (page ?? 1) < pages,
      total,
    };
  }
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
      include: {
        profile: true,
      },
    });
  }

  findOneByUserName(userName: string) {
    return this.prisma.user.findFirst({
      where: {
        userName,
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
  async updateRole(id: number, role: Role): Promise<UserDto> {
    const findUser = await this.findOneById(id);
    if (!findUser) {
      throw new BadRequestException('User not found');
    }
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }

  async updateProfile(
    id: number,
    { email, firstName, phoneNumber, lastName }: UpdateProfileDto,
    avatar?: string,
  ) {
    const user = await this.findOneById(id);
    if (!user) throw new BadRequestException('User not found');
    if (phoneNumber) {
      const foundUser = await this.findOneByPhoneNumber(phoneNumber);
      if (foundUser && foundUser.id !== id)
        throw new BadRequestException('phoneNumber is duplicate');
    }
    if (email) {
      const foundUser = await this.findOneByPhoneNumber(email);
      if (foundUser && foundUser.id !== id)
        throw new BadRequestException('email is duplicate');
    }
    return this.prisma.user.update({
      where: {
        id,
      },
      include: { profile: true },
      data: {
        email,
        phoneNumber,
        profile: {
          update: {
            firstName,
            lastName,
            avatar,
          },
        },
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }
  async update({
    id,
    phoneNumber,
    role,
    email,
    firstName,
    lastName,
    userName,
  }: UpdateUserDto) {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        role,
        phoneNumber,
        userName,
        profile: {
          update: {
            firstName,
            lastName,
          },
        },
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
  }

  async delete(id: number): Promise<UserDto> {
    const user = await this.findOneById(id);
    if (!user) throw new BadRequestException('User not found ');
    const deletedUser = await this.prisma.user.delete({
      where: {
        id,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });
    return deletedUser;
  }
}
