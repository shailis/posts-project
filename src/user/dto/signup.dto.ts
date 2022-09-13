import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(128)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  password: string;
}
