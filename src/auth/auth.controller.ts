import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import {
  AUTH_SERVICE_NAME,
  AuthServiceControllerMethods,
  SignUpRequest,
} from './auth.pb';

@AuthServiceControllerMethods()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  protected readonly logger = new Logger(AuthController.name);

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignUp')
  signUp(signUpRequest: SignUpRequest) {
    this.logger.log('Received SignUpRequest request');
    return this.authService.signUp(signUpRequest);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SignIn')
  signIn(signInRequest: SignUpRequest) {
    this.logger.log('Received SignInRequest request');
    return this.authService.signIn(signInRequest.email, signInRequest.password);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ConfirmEmail')
  confirmEmail({ token }: { token: string }) {
    this.logger.log('Received ConfirmEmail request');
    return this.authService.confirmEmail(token);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'ResetPassword')
  resetPassword({ email }: { email: string }) {
    this.logger.log('Received ResetPassword request');
    return this.authService.resetPassword(email);
  }

  @GrpcMethod(AUTH_SERVICE_NAME, 'SetNewPassword')
  setNewPassword({ token, password }: { token: string; password: string }) {
    this.logger.log('Received SetNewPassword request');
    return this.authService.setNewPassword(token, password);
  }
}
