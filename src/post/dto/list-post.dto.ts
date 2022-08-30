import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class ListPostDto {
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? parseInt(value) : value;
  })
  page: number;

  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? parseInt(value) : value;
  })
  perPage: number;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort: string;
}
