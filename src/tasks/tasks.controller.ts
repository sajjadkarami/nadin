import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserEntity } from '../auth/decorator/userEntity';
import { JwtDto } from '../auth/dto/Jwt.dto';
import { Role } from '../auth/dto/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwtAuthGuard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { getFileFormat } from '../utils/files.util';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskFindFilter } from './dto/taskFindFilters.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'add a new task with an optional attachment',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        attachment: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: './files/tasks/',
        filename(req, file, callback) {
          const user = req.user as JwtDto;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const taskName = req.body.name as string;
          if (!file) {
            return;
          }
          callback(null, `${user.userId}.${taskName}.${getFileFormat(file)}`);
        },
      }),
    }),
  )
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(
    @UserEntity() { userId }: JwtDto,
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.tasksService.create(
      userId,
      createTaskDto,
      attachment
        ? `${userId}.${createTaskDto.name}.${getFileFormat(attachment)}`
        : undefined,
    );
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() filters: TaskFindFilter, @UserEntity() { userId }: JwtDto) {
    return this.tasksService.findAll({ ...filters, userId });
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @UserEntity() { userId }: JwtDto) {
    return this.tasksService.findOne(+id, userId);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateTaskDto,
  })
  @UseInterceptors(FileInterceptor('attachment'))
  @Patch(':id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @UserEntity() { userId }: JwtDto,
    @Body() updateTaskDto: UpdateTaskDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let attachment: string | undefined;
    if (file) {
      attachment = file.filename;
    }
    return this.tasksService.update(+id, userId, updateTaskDto, attachment);
  }

  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserEntity() { userId }: JwtDto) {
    return this.tasksService.remove(+id, userId);
  }
}
