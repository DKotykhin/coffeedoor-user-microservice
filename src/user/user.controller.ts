import {
  Controller,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TranslateHttpToGrpcExceptionFilter } from '../utils/error-translate';
import { EmailDto, PasswordDto } from '../auth/dto/auth.dto';

import { UserService } from './user.service';
import { USER_SERVICE_NAME, UserServiceControllerMethods } from './user.pb';
import { UpdateUserDto } from './dto/update-user.dto';

@UserServiceControllerMethods()
@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(new TranslateHttpToGrpcExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}
  protected readonly logger = new Logger(UserController.name);

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserByEmail')
  getUserByEmail({ email }: EmailDto) {
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
  confirmPassword({
    id,
    password,
  }: {
    id: string;
    password: PasswordDto['password'];
  }) {
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
  }) {
    this.logger.log('Received ChangePassword request');
    return this.userService.changePassword({ id, password });
  }
}
