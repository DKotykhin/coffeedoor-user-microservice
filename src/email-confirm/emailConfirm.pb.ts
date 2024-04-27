/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Timestamp } from "../protobuf/timestamp";

export const protobufPackage = "emailConfirm";

export interface EmailConfirm {
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

export const EMAIL_CONFIRM_PACKAGE_NAME = "emailConfirm";

export interface EmailConfirmServiceClient {
  create(request: CreateRequest): Observable<EmailConfirm>;

  getByToken(request: GetByTokenRequest): Observable<EmailConfirm>;

  verify(request: Id): Observable<EmailConfirm>;
}

export interface EmailConfirmServiceController {
  create(request: CreateRequest): Promise<EmailConfirm> | Observable<EmailConfirm> | EmailConfirm;

  getByToken(request: GetByTokenRequest): Promise<EmailConfirm> | Observable<EmailConfirm> | EmailConfirm;

  verify(request: Id): Promise<EmailConfirm> | Observable<EmailConfirm> | EmailConfirm;
}

export function EmailConfirmServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "getByToken", "verify"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EmailConfirmService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EmailConfirmService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const EMAIL_CONFIRM_SERVICE_NAME = "EmailConfirmService";
