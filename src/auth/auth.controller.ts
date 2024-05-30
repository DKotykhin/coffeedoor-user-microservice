import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import {
  AUTH_SERVICE_NAME,
  AuthServiceControllerMethods,
  Email,
  SetNewPasswordRequest,
  SignInRequest,
  SignUpRequest,
  StatusResponse,
  User,
} from './auth.pb';

@AuthServiceControllerMethods()
@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  protected readonly logger = new Logger(AuthController.name);

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  signUp(signUpRequest: SignUpRequest): Promise<User> {
    this.logger.log('Received SignUpRequest request');
    return this.authService.signUp(signUpRequest);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignIn')
  signIn(signInRequest: SignInRequest): Promise<User> {
    this.logger.log('Received SignInRequest request');
    return this.authService.signIn(signInRequest);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ConfirmEmail')
  confirmEmail({ token }: { token: string }): Promise<StatusResponse> {
    this.logger.log('Received ConfirmEmail request');
    return this.authService.confirmEmail(token);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ResendEmail')
  resendEmail({ email }: Email): Promise<StatusResponse> {
    this.logger.log('Received ResendEmail request');
    return this.authService.resendEmail(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ResetPassword')
  resetPassword({ email }: Email): Promise<StatusResponse> {
    this.logger.log('Received ResetPassword request');
    return this.authService.resetPassword(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SetNewPassword')
  setNewPassword({
    token,
    password,
  }: SetNewPasswordRequest): Promise<StatusResponse> {
    this.logger.log('Received SetNewPassword request');
    return this.authService.setNewPassword(token, password);
  }
}
