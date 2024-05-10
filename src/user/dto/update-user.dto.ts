import { PartialType } from '@nestjs/mapped-types';
import { IsString, Length, IsOptional, IsMobilePhone } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  userName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  address?: string;

  @IsOptional()
  @IsString()
  @Length(10, 13, { message: 'Phone must be between 10 and 13 characters' })
  @IsMobilePhone('uk-UA')
  phoneNumber?: string;
}
