import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfirmService } from '../email-confirm.service';

describe('EmailConfirmService', () => {
  let service: EmailConfirmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailConfirmService],
    }).compile();

    service = module.get<EmailConfirmService>(EmailConfirmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
