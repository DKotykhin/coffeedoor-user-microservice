import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { UserService } from './user.service';
import {
  PasswordRequest,
  USER_SERVICE_NAME,
  UserServiceControllerMethods,
} from './user.pb';
import { UpdateUserDto } from './dto/update-user.dto';

@UserServiceControllerMethods()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  protected readonly logger = new Logger(UserController.name);

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserByEmail')
  getUserByEmail({ email }: { email: string }) {
    this.logger.log('Received GetUserByEmail request');
    return this.userService.getUserByEmail(email);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  getUserById({ id }: { id: string }) {
    this.logger.log('Received GetUserById request');
    return this.userService.getUserById(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  updateUser(updateUserRequest: UpdateUserDto) {
    this.logger.log('Received UpdateUser request');
    return this.userService.update(updateUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  deleteUser({ id }: { id: string }) {
    this.logger.log('Received DeleteUser request');
    return this.userService.remove(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ConfirmPassword')
  confirmPassword(passwordRequest: PasswordRequest) {
    this.logger.log('Received ConfirmPassword request');
    return this.userService.confirmPassword(passwordRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangePassword')
  changePassword(passwordRequest: PasswordRequest) {
    this.logger.log('Received ChangePassword request');
    return this.userService.changePassword(passwordRequest);
  }
}
