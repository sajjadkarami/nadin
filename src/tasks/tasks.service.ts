import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { TaskFindFilter } from './dto/taskFindFilters.dto';
import { TaskList } from './dto/taskList.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskOrderBy } from './dto/taskOrderBy.enum';
import { Order } from '../common/dto/order.enum';
import { Role } from '../auth/dto/role.enum';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll({
    order,
    orderBy,
    name,
    page,
    description,
    take,
    userId,
  }: TaskFindFilter): Promise<TaskList> {
    let orderResult: { [key in TaskOrderBy]?: Order } | undefined;
    if (order && orderBy) {
      orderResult = { [orderBy]: order };
    }

    const where = {
      AND: [
        {
          name: name ? { contains: name } : undefined,
          description: description ? { contains: description } : undefined,
          userId: userId,
        },
      ].filter(Boolean),
    };

    const skip = ((page ?? 1) - 1) * (take ?? 10);

    const total = await this.prisma.task.count({ where });
    const pages = Math.ceil(total / (take ?? 10));
    const tasks = await this.prisma.task.findMany({
      orderBy: orderResult,
      take: take ?? 10,
      skip,
      where,
      include: {
        User: {
          select: {
            id: true,
            userName: true,
            email: true,
          },
        },
      },
    });

    return {
      data: tasks,
      page: page ?? 1,
      pages,
      hasNextPage: (page ?? 1) < pages,
      total,
    };
  }

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

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            userName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (task.userId !== userId && user.role !== Role.ADMIN)) {
      throw new BadRequestException('You can only view your own tasks');
    }

    return task;
  }

  async update(
    id: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
    attachment?: string,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.userId !== userId) {
      throw new BadRequestException('You can only update your own tasks');
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        attachment: attachment,
      },
      include: {
        User: {
          select: {
            id: true,
            userName: true,
            phoneNumber: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (task.userId !== userId && user.role !== Role.ADMIN)) {
      throw new BadRequestException('You can only delete your own tasks');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
