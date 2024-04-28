import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { EmailConfirm } from '../entities/email-confirm.entity';
import { ResetPassword } from '../entities/reset-password.entity';
import { UserService } from '../../user/user.service';
import { PasswordHashService } from '../../password-hash/password-hash.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(EmailConfirm),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ResetPassword),
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: PasswordHashService,
          useValue: {},
        },
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
