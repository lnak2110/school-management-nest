import { IsString, IsNotEmpty, Length } from 'class-validator';

export class FindStudentByClassDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  className: string;
}
