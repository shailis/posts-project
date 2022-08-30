import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<{
    statusCode: HttpStatus;
    data: Omit<User, 'password'>;
    message: any;
  }> {
    try {
      // hash password
      const passwordHash = await this.generateHash(signUpDto.password);

      // generate authToken
      const id = randomUUID();
      const authToken = await this.generateToken(id, signUpDto.email);

      // create user
      const user: User = await this.prisma.user.create({
        data: {
          id: id,
          name: signUpDto.name,
          email: signUpDto.email,
          password: passwordHash,
          authToken: authToken,
          createdAt: new Date().getTime(),
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: this.exclude(user, 'password'),
        message: this.i18n.t('user.SignUpSuccessful'),
      };
    } catch (err) {
      let statusCode: HttpStatus;
      let message: any;
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          statusCode = HttpStatus.BAD_REQUEST;
          message = this.i18n.t('user.DuplicateEmail');
        }
      } else {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = err.message;
      }

      this.handleError({ status: statusCode, message: message });
    }
  }

  async signin(signInDto: SignInDto): Promise<{
    statusCode: HttpStatus;
    data: Omit<User, 'password'>;
    message: any;
  }> {
    try {
      // find user
      const user: User = await this.prisma.user.findUnique({
        where: {
          email: signInDto.email,
        },
      });

      // if no such user, throw exception
      if (!user) {
        // throw new UnauthorizedException(this.i18n.t('user.InvalidEmail'));
        throw new HttpException(
          this.i18n.t('user.InvalidEmail'),
          HttpStatus.UNAUTHORIZED,
        );
      }

      // compare entered password with password in db
      const comparePassword = bcrypt.compareSync(
        signInDto.password,
        user.password,
      );

      // if password doesn't match, throw exception
      if (!comparePassword) {
        throw new HttpException(
          this.i18n.t('user.InvalidPassword'),
          HttpStatus.UNAUTHORIZED,
        );
      }

      // else generate authToken and update user
      const authToken: string = await this.generateToken(user.id, user.email);

      const updatedUserWithAuthToken = await this.prisma.user.update({
        where: { id: user.id },
        data: { authToken: authToken },
      });

      return {
        statusCode: HttpStatus.OK,
        data: this.exclude(updatedUserWithAuthToken, 'password'),
        message: this.i18n.t('user.SignInSuccessful'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async signout(userId: string): Promise<{
    statusCode: HttpStatus;
    data: Omit<User, 'password'>;
    message: any;
  }> {
    try {
      const userWithoutAuthToken = await this.prisma.user.update({
        where: { id: userId },
        data: { authToken: '' },
      });

      return {
        statusCode: HttpStatus.OK,
        data: this.exclude(userWithoutAuthToken, 'password'),
        message: this.i18n.t('user.SignOutSuccessful'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async generateHash(password: string): Promise<string> {
    const saltRounds = 10;
    const passwordHash: string = await bcrypt.hash(password, saltRounds);
    return passwordHash;
  }

  async generateToken(id: string, email: string): Promise<string> {
    const payload = { sub: id, email: email };
    const authToken: string = await this.jwt.signAsync(payload);
    return authToken;
  }

  exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }

  handleError(err: { status: any; message: any }): void {
    Logger.error(err);
    throw new HttpException(err.message, err.status);
  }
}
