import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { HashService } from '../utils/hash.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
