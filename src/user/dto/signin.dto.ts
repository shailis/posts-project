import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(128)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  password: string;
}
