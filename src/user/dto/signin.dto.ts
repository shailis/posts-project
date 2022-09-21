import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { constants } from 'src/common/constants';

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(constants.USER_ATTRIBUTES_LENGTH.EMAIL)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(constants.USER_ATTRIBUTES_LENGTH.PASSWORD)
  password: string;
}
