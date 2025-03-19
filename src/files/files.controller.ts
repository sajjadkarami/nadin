import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserEntity } from '../auth/decorator/userEntity';
import { JwtDto } from '../auth/dto/Jwt.dto';
import { Role } from '../auth/dto/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FilesService } from './files.service';

@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('avatar')
  async getAvatar(@UserEntity() { userId }: JwtDto, @Res() res: Response) {
    const avatar = await this.filesService.getAvatar(userId);
    if (!avatar) {
      throw new BadRequestException('avatar not exists');
    }
    const path = join(join(process.cwd()), `files/avatars/${avatar}`);
    const exists = existsSync(path);
    if (!exists) {
      throw new BadRequestException('avatar not exists');
    }
    res.download(path);
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('attachment/:taskId')
  async getAttachment(
    @UserEntity() { userId }: JwtDto,
    @Param('taskId') taskId: number,
    @Res() res: Response,
  ) {
    const attachment = await this.filesService.getAttachment(userId, taskId);
    if (!attachment) {
      throw new BadRequestException('attachment not exists');
    }
    const path = join(join(process.cwd()), `files/tasks/${attachment}`);
    const exists = existsSync(path);
    if (!exists) {
      throw new BadRequestException('attachment not exists');
    }
    res.download(path);
    return attachment;
  }
}
