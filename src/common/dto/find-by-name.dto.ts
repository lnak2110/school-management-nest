import { IsString, IsNotEmpty, Length } from 'class-validator';

export class FindByNameDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  keyword: string;
}
