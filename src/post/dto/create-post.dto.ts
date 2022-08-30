import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

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
  isPublished: boolean;
}
