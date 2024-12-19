import { IsNumber, IsPositive } from 'class-validator';

export class RemoveStudentDto {
  @IsNumber()
  @IsPositive()
  id: number;
}
