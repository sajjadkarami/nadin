import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async create(
    userId: number,
    { name, description }: CreateTaskDto,
    attachment?: string,
  ) {
    const task = await this.prisma.task.findFirst({
      where: {
        name,
        userId,
      },
    });
    if (task) {
      throw new BadRequestException('Task Already created');
    }
    return this.prisma.task.create({
      data: {
        name,
        description,
        attachment: attachment,
        userId,
      },
    });
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
