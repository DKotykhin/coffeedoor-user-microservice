/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../protobuf/timestamp";

export const protobufPackage = "passwordReset";

export interface PasswordReset {
  id: string;
  token: string;
  expiredAt: Timestamp | undefined;
  verifiedAt: Timestamp | undefined;
  user: User | undefined;
}

export interface User {
  id: string;
}

export interface Id {
  id: string;
}

export interface CreateRequest {
  userId: string;
  token: string;
}

export interface GetByTokenRequest {
  token: string;
}

export const PASSWORD_RESET_PACKAGE_NAME = "passwordReset";

export interface PasswordResetServiceClient {
  create(request: CreateRequest): Observable<PasswordReset>;

  getByToken(request: GetByTokenRequest): Observable<PasswordReset>;

  verify(request: Id): Observable<PasswordReset>;
}

export interface PasswordResetServiceController {
  create(request: CreateRequest): Promise<PasswordReset> | Observable<PasswordReset> | PasswordReset;

  getByToken(request: GetByTokenRequest): Promise<PasswordReset> | Observable<PasswordReset> | PasswordReset;

  verify(request: Id): Promise<PasswordReset> | Observable<PasswordReset> | PasswordReset;
}

export function PasswordResetServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "getByToken", "verify"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PasswordResetService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PasswordResetService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PASSWORD_RESET_SERVICE_NAME = "PasswordResetService";
