import {
  ClassSerializerInterceptor,
  Controller,
  Logger,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { EmailDto, PasswordDto } from '../auth/dto/auth.dto';

import { UserService } from './user.service';
import {
  StatusResponse,
  USER_SERVICE_NAME,
  User,
  UserServiceControllerMethods,
} from './user.pb';
import { UpdateUserDto } from './dto/update-user.dto';

@UserServiceControllerMethods()
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}
  protected readonly logger = new Logger(UserController.name);

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserByEmail')
  getUserByEmail({ email }: EmailDto): Promise<Partial<User>> {
    this.logger.log('Received GetUserByEmail request');
    return this.userService.getUserByEmail(email);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  getUserById({ id }: { id: string }): Promise<User> {
    this.logger.log('Received GetUserById request');
    return this.userService.getUserById(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  updateUser(updateUserRequest: UpdateUserDto): Promise<User> {
    this.logger.log('Received UpdateUser request');
    return this.userService.update(updateUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  deleteUser({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received DeleteUser request');
    return this.userService.remove(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ConfirmPassword')
  confirmPassword({
    id,
    password,
  }: {
    id: string;
    password: PasswordDto['password'];
  }): Promise<StatusResponse> {
    this.logger.log('Received ConfirmPassword request');
    return this.userService.confirmPassword({ id, password });
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangePassword')
  changePassword({
    id,
    password,
  }: {
    id: string;
    password: PasswordDto['password'];
  }): Promise<StatusResponse> {
    this.logger.log('Received ChangePassword request');
    return this.userService.changePassword({ id, password });
  }
}
