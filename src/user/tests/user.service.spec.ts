import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { UserService } from '../user.service';
import { PasswordHashService } from '../../password-hash/password-hash.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: PasswordHashService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
