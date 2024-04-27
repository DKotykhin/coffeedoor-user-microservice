import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { PasswordHash } from '../utils/passwordHash';
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
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { email } });
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // const user = new User(createUserDto);
      // return await this.entityManager.save(User, user);
      return await this.entityManager.save(User, createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.entityManager.save(User, {
        ...updateUserDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: `User id ${id} successfully deleted`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await PasswordHash.compare(
      password,
      user.passwordHash,
      'Password not match',
    );
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
      throw new HttpException(
        'New password is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await PasswordHash.same(password, user.passwordHash, 'The same password!');
    const passwordHash = await PasswordHash.create(password);
    user.passwordHash = passwordHash;
    await this.entityManager.save(User, user);
    return {
      status: true,
      message: 'Password successfully changed',
    };
  }
}
