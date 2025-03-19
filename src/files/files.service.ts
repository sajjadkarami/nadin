import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}
  async getAvatar(userId: number): Promise<string | null> {
    const profile = await this.prisma.profile.findFirst({
      where: { userId },
    });
    if (!profile) {
      throw new BadRequestException('User not found');
    }
    return profile.avatar;
  }
}
