import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { UserService } from './user.service';
import {
  Email,
  PasswordRequest,
  StatusResponse,
  USER_SERVICE_NAME,
  UpdateUserRequest,
  User,
  UserServiceControllerMethods,
} from './user.pb';

@UserServiceControllerMethods()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  protected readonly logger = new Logger(UserController.name);

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserByEmail')
  getUserByEmail({ email }: Email): Promise<User> {
    this.logger.log('Received GetUserByEmail request');
    return this.userService.getUserByEmail(email);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  getUserById({ id }: { id: string }): Promise<User> {
    this.logger.log('Received GetUserById request');
    return this.userService.getUserById(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  updateUser(updateUserRequest: UpdateUserRequest): Promise<User> {
    this.logger.log('Received UpdateUser request');
    return this.userService.update(updateUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  deleteUser({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received DeleteUser request');
    return this.userService.remove(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ConfirmPassword')
  confirmPassword({ id, password }: PasswordRequest): Promise<StatusResponse> {
    this.logger.log('Received ConfirmPassword request');
    return this.userService.confirmPassword({ id, password });
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangePassword')
  changePassword({ id, password }: PasswordRequest): Promise<StatusResponse> {
    this.logger.log('Received ChangePassword request');
    return this.userService.changePassword({ id, password });
  }
}
