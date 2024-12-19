import {
  IsString,
  IsNotEmpty,
  Length,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsInt()
  @IsPositive()
  classId: number;
}
