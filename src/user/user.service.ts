import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { PasswordHashService } from '../password-hash/password-hash.service';
import { RoleTypes } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { StatusResponse, UpdateUserRequest } from './user.pb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly passwordHashService: PasswordHashService,
  ) {}
  protected readonly logger = new Logger(UserService.name);

  async getUserByEmailWithRelations(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['emailConfirm', 'resetPassword'],
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<Partial<User>> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) {
        throw ErrorImplementation.notFound('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw ErrorImplementation.notFound('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.entityManager.save(User, createUserDto);
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.badRequest("Can't create user");
    }
  }

  async update(updateUserDto: UpdateUserRequest): Promise<User> {
    try {
      const updatedUser = await this.userRepository.preload({
        ...updateUserDto,
        role: updateUserDto.role as RoleTypes,
      });
      if (!updatedUser) {
        throw ErrorImplementation.notFound('User not found');
      }
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('User not found');
      }
      return {
        status: true,
        message: `User id ${id} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async confirmPassword({
    id,
    password,
  }: {
    id: string;
    password: string;
  }): Promise<StatusResponse> {
    if (!password) {
      throw ErrorImplementation.badRequest('Password is required');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw ErrorImplementation.notFound('User not found');
    }
    await this.passwordHashService.compare(password, user.passwordHash);
    return {
      status: true,
      message: 'Password confirmed',
    };
  }

  async changePassword({
    id,
    password,
  }: {
    id: string;
    password: string;
  }): Promise<StatusResponse> {
    if (!password) {
      throw ErrorImplementation.badRequest('New password is required');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw ErrorImplementation.notFound('User not found');
    }
    try {
      await this.passwordHashService.same(password, user.passwordHash);
      const passwordHash = await this.passwordHashService.create(password);
      user.passwordHash = passwordHash;
      await this.entityManager.save(User, user);
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.badRequest(error.message);
    }
    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}
