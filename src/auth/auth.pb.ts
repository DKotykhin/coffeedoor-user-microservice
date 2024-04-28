/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

export interface User {
  id: string;
  userName: string;
  email: string;
  role: string;
  isVerified: boolean;
  avatar?: string | undefined;
  phoneNumber?: string | undefined;
  address?: string | undefined;
}

export interface Email {
  email: string;
}

export interface Token {
  token: string;
}

export interface SignUpRequest {
  userName: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SetNewPasswordRequest {
  token: string;
  password: string;
}

export interface StatusResponse {
  status: boolean;
  message: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  signUp(request: SignUpRequest): Observable<User>;

  signIn(request: SignInRequest): Observable<User>;

  confirmEmail(request: Token): Observable<StatusResponse>;

  resendEmail(request: Email): Observable<StatusResponse>;

  resetPassword(request: Email): Observable<StatusResponse>;

  setNewPassword(request: SetNewPasswordRequest): Observable<StatusResponse>;
}

export interface AuthServiceController {
  signUp(request: SignUpRequest): Promise<User> | Observable<User> | User;

  signIn(request: SignInRequest): Promise<User> | Observable<User> | User;

  confirmEmail(request: Token): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  resendEmail(request: Email): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  resetPassword(request: Email): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  setNewPassword(request: SetNewPasswordRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "signUp",
      "signIn",
      "confirmEmail",
      "resendEmail",
      "resetPassword",
      "setNewPassword",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
