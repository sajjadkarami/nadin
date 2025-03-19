import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDto {
  id: number;
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  @ApiProperty({ enumName: 'role', enum: Role })
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
