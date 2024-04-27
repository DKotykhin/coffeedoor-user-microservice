import { Test, TestingModule } from '@nestjs/testing';
import { EmailConfirmController } from '../email-confirm.controller';
import { EmailConfirmService } from '../email-confirm.service';

describe('EmailConfirmController', () => {
  let controller: EmailConfirmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailConfirmController],
      providers: [EmailConfirmService],
    }).compile();

    controller = module.get<EmailConfirmController>(EmailConfirmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
