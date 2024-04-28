import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { PasswordHashService } from '../password-hash/password-hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { StatusResponse } from './user.pb';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.entityManager.save(User, createUserDto);
    } catch (error) {
      throw new RpcException("Can't create user");
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.entityManager.save(User, {
        ...updateUserDto,
      });
    } catch (error) {
      throw new RpcException("Can't update user");
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException('User not found');
      }
      return {
        status: true,
        message: `User id ${id} successfully deleted`,
      };
    } catch (error) {
      throw new RpcException("Can't delete user");
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
      throw new RpcException('Password is required');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new RpcException('User not found');
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
      throw new RpcException('New password is required');
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new RpcException('User not found');
    }
    await this.passwordHashService.same(password, user.passwordHash);
    const passwordHash = await this.passwordHashService.create(password);
    user.passwordHash = passwordHash;
    await this.entityManager.save(User, user);
    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}
