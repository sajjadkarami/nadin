import { Role } from './role.enum';

export interface JwtDto {
  userId: number;

  role: Role;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}
