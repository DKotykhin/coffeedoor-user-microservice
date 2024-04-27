import { Controller } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

@Controller()
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}
}
