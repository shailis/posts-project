import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(128)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  password: string;
}
