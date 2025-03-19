import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '../auth/dto/role.enum';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async getAvatar(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { profile: { select: { avatar: true } } },
    });

    if (!user?.profile?.avatar) {
      throw new NotFoundException('Avatar not found');
    }

    return user.profile.avatar;
  }

  async getAttachment(userId: number, taskId: number): Promise<string> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        User: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!task.attachment) {
      throw new NotFoundException('Attachment not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (task.userId !== userId && user.role !== Role.ADMIN)) {
      throw new BadRequestException(
        'You can only access your own task attachments',
      );
    }

    return task.attachment;
  }
}
