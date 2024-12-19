import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsInt()
  @IsPositive()
  id: number;
}
