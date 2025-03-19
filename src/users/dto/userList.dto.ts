import { BasePaginateList } from '../../common/dto/basePaginateList.dto';
import { UserDto } from './user.dto';

export class UserList extends BasePaginateList {
  data: UserDto[];
}
