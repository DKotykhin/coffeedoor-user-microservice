import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailConfirmService } from './email-confirm.service';
import { EmailConfirmController } from './email-confirm.controller';
import { EmailConfirm } from './entities/email-confirm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailConfirm])],
  controllers: [EmailConfirmController],
  providers: [EmailConfirmService],
})
export class EmailConfirmModule {}
