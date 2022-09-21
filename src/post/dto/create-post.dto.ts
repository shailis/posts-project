import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { constants } from 'src/common/constants';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(constants.POST_ATTRIBUTES_LENGTH.TITLE)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  })
  isPublished?: boolean;
}
