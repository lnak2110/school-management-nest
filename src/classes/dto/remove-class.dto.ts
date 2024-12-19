import { IsInt, IsPositive } from 'class-validator';

export class RemoveClassDto {
  @IsInt()
  @IsPositive()
  id: number;
}
