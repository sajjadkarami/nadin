import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { HashService } from '../utils/hash.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, HashService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
