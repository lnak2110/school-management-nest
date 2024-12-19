import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;
}
