import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { UserService } from './user.service';
import {
  PasswordRequest,
  USER_SERVICE_NAME,
  UserServiceControllerMethods,
} from './user.pb';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UserServiceControllerMethods()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserByEmail')
  getUserByEmail({ email }: { email: string }) {
    return this.userService.getUserByEmail(email);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  getUserById({ id }: { id: string }) {
    return this.userService.getUserById(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  createUser(createUserRequest: CreateUserDto) {
    return this.userService.create(createUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  updateUser(updateUserRequest: UpdateUserDto) {
    return this.userService.update(updateUserRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  deleteUser({ id }: { id: string }) {
    return this.userService.remove(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ConfirmPassword')
  confirmPassword(passwordRequest: PasswordRequest) {
    return this.userService.confirmPassword(passwordRequest);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'ChangePassword')
  changePassword(passwordRequest: PasswordRequest) {
    return this.userService.changePassword(passwordRequest);
  }
}
