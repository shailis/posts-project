import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsBoolean()
  @IsOptional()
  @Transform((val) => {
    switch (val.obj.isPublished) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return val.obj.isPublished;
    }
  })
  isPublished: boolean;
}
