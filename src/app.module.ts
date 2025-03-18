import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    CacheModule.register({
      isGlobal: true,
      stores: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: parseInt(process.env.REDIS_INDEX || '0'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
