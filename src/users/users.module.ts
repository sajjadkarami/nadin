import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { HashService } from '../utils/hash.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
