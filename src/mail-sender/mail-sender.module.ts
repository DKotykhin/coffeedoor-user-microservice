import { Module } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MailSenderService],
  exports: [MailSenderService],
})
export class MailSenderModule {}
