export class UserDto {
  id: number;
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
