import { IsString, IsNotEmpty, Length } from 'class-validator';

export class FindStudentByNameDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  keyword: string;
}
