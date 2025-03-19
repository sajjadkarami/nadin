import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';

import { Role } from '../auth/dto/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateRoleDto } from '../common/dto/updateRole.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserDto } from './dto/user.dto';
import { UserFindFilter } from './dto/userFindFilters';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtDto } from '../auth/dto/Jwt.dto';
import { diskStorage } from 'multer';
import { UserEntity } from '../auth/decorator/userEntity';
import { getFileFormat } from '../utils/files.util';
@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAll(@Query() filters: UserFindFilter) {
    return this.usersService.findAll(filters);
  }

  @Get('me')
  async me(@UserEntity() { userId }) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('UserNotFound');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...returnUser } = user;
    return returnUser;
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<UserDto> {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithOutPassword } = user;
    return userWithOutPassword;
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/updateRole/:id')
  updateRole(@Param('id') id: number, @Body() { role }: UpdateRoleDto) {
    return this.usersService.updateRole(id, role);
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './files/avatars/',
        filename(req, file, callback) {
          const user = req.user as JwtDto;
          if (!file) {
            return;
          }
          callback(null, `${user.userId}.${getFileFormat(file)}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  @Post('/updateProfile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'user profile data including an optional avatar',
    required: true,
    schema: {
      type: 'object',
      required: [],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
        },
        phoneNumber: { type: 'string', example: '+1234567890' },
        lastName: { type: 'string', example: 'Doe' },
        firstName: { type: 'string', example: 'John' },
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  updateProfile(
    @UserEntity() { userId }: JwtDto,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      return this.usersService.updateProfile(
        userId,
        dto,
        `${userId}.${getFileFormat(avatar)}`,
      );
    }
    return this.usersService.updateProfile(userId, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  update(@Body() dto: UpdateUserDto) {
    return this.usersService.update(dto);
  }

  @ApiParam({
    name: 'id',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  delete(@Param() id: number) {
    return this.usersService.delete(id);
  }
}
