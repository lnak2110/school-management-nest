import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class IdParamDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  id: number;
}
