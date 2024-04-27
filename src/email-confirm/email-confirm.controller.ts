import { Controller } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';

@Controller()
export class EmailConfirmController {
  constructor(private readonly emailConfirmService: EmailConfirmService) {}
}
