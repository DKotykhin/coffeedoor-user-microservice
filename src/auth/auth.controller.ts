import {
  Controller,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { TranslateHttpToGrpcExceptionFilter } from '../utils/error-translate';
import { AuthService } from './auth.service';
import { AUTH_SERVICE_NAME, AuthServiceControllerMethods } from './auth.pb';
import { EmailDto, PasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';

@AuthServiceControllerMethods()
@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
@UseFilters(new TranslateHttpToGrpcExceptionFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  protected readonly logger = new Logger(AuthController.name);

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  signUp(signUpRequest: SignUpDto) {
    this.logger.log('Received SignUpRequest request');
    return this.authService.signUp(signUpRequest);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignIn')
  signIn(signInRequest: SignInDto) {
    this.logger.log('Received SignInRequest request');
    return this.authService.signIn(signInRequest.email, signInRequest.password);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ConfirmEmail')
  confirmEmail({ token }: { token: string }) {
    this.logger.log('Received ConfirmEmail request');
    return this.authService.confirmEmail(token);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ResetPassword')
  resetPassword({ email }: EmailDto) {
    this.logger.log('Received ResetPassword request');
    return this.authService.resetPassword(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SetNewPassword')
  setNewPassword({
    token,
    password,
  }: {
    token: string;
    password: PasswordDto['password'];
  }) {
    this.logger.log('Received SetNewPassword request');
    return this.authService.setNewPassword(token, password);
  }
}