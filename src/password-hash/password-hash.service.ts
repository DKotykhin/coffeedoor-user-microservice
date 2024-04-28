import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { ErrorImplementation } from '../utils/error-implementation';

@Injectable()
export class PasswordHashService {
  private readonly index = 5;

  async create(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.index);
    const passwordHash = await bcrypt.hash(password, salt);
    if (!passwordHash) {
      throw ErrorImplementation.forbidden("Can't create password hash");
    }
    return passwordHash;
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    const isValidPass = await bcrypt.compare(password, passwordHash);
    if (!isValidPass) {
      throw ErrorImplementation.badRequest('Password not match');
    }
    return isValidPass;
  }

  async same(password: string, passwordHash: string): Promise<boolean> {
    const isValidPass = await bcrypt.compare(password, passwordHash);
    if (isValidPass) {
      throw ErrorImplementation.badRequest('The same password!');
    }
    return isValidPass;
  }
}
