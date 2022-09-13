import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { constants } from 'src/common/constants';

export class ListPostDto {
  @ApiPropertyOptional({ default: constants.LIST_PAGE_NUMBER })
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? parseInt(value) : value;
  })
  page?: number = constants.LIST_PAGE_NUMBER;

  @ApiPropertyOptional({ default: constants.LIST_PER_PAGE_NUMBER })
  @IsOptional()
  @Transform(({ value }) => {
    return typeof value === 'string' ? parseInt(value) : value;
  })
  perPage?: number = constants.LIST_PER_PAGE_NUMBER;

  @ApiPropertyOptional()
  @IsString()
  @IsIn([constants.ASC_SORT_ORDER, constants.DESC_SORT_ORDER])
  @IsOptional()
  sort?: string = constants.DESC_SORT_ORDER;
}
