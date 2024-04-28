/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface User {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  address?: string | undefined;
  phoneNumber?: string | undefined;
  avatar?: string | undefined;
  isVerified: boolean;
  role: string;
}

export interface Id {
  id: string;
}

export interface Email {
  email: string;
}

export interface StatusResponse {
  status: boolean;
  message: string;
}

export interface PasswordRequest {
  id: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  userName?: string | undefined;
  passwordHash?: string | undefined;
  address?: string | undefined;
  phoneNumber?: string | undefined;
  avatar?: string | undefined;
  isVerified?: boolean | undefined;
  role?: string | undefined;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUserByEmail(request: Email): Observable<User>;

  getUserById(request: Id): Observable<User>;

  updateUser(request: UpdateUserRequest): Observable<User>;

  deleteUser(request: Id): Observable<StatusResponse>;

  confirmPassword(request: PasswordRequest): Observable<StatusResponse>;

  changePassword(request: PasswordRequest): Observable<StatusResponse>;
}

export interface UserServiceController {
  getUserByEmail(request: Email): Promise<User> | Observable<User> | User;

  getUserById(request: Id): Promise<User> | Observable<User> | User;

  updateUser(request: UpdateUserRequest): Promise<User> | Observable<User> | User;

  deleteUser(request: Id): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  confirmPassword(request: PasswordRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;

  changePassword(request: PasswordRequest): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUserByEmail",
      "getUserById",
      "updateUser",
      "deleteUser",
      "confirmPassword",
      "changePassword",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
