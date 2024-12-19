import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
  @IsInt()
  @IsPositive()
  id: number;
}
