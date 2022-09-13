import { ConsoleLogger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategy';
import { HandleErrorClass } from 'src/common/helpers/handle-error.helper';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, ConsoleLogger, JwtStrategy, HandleErrorClass],
})
export class UserModule {}
