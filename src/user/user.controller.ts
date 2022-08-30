import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guard';
import { GetUser } from '../common/decorator';
import { SignInDto, SignUpDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    Logger.log('user-->user.controller.ts-->signup');
    return this.userService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    Logger.log('user-->user.controller.ts-->signin');
    return this.userService.signin(signInDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signout(@GetUser('id') userId: string) {
    Logger.log('user-->user.controller.ts-->signout');
    return this.userService.signout(userId);
  }
}
