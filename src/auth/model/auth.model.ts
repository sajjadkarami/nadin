import { UserDto } from '../../users/dto/user.dto';
import { Token } from './token.model';

export class Auth extends Token {
  user: UserDto;
}
