import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashService {
  async hash(text: string) {
    const salt = await bcrypt.genSalt();
    const hashedText = await bcrypt.hash(text, salt);
    return hashedText;
  }

  async compare(text: string, hashedText: string) {
    const compare = await bcrypt.compare(text, hashedText);
    return compare;
  }
}
