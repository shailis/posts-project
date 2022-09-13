import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ResponseDto } from 'src/common/dto';
import { HandleErrorClass } from 'src/common/helpers/handle-error.helper';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly i18n: I18nService,
    private readonly handleErrorClass: HandleErrorClass,
  ) {}

  /**
   * @function signup
   * @description Signs up a user
   * @author Shaili S.
   * @module user
   * @param signUpDto
   * @returns { statusCode: HttpStatus; data: Omit<User, 'password'>; message: any }
   */
  async signup(signUpDto: SignUpDto): Promise<ResponseDto> {
    Logger.log('user-->user.service.ts-->signup');
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

      this.handleErrorClass.handleError({
        status: statusCode,
        message: message,
      });
    }
  }

  /**
   * @function signin
   * @description Signs in a user
   * @author Shaili S.
   * @module user
   * @param signInDto
   * @returns { statusCode: HttpStatus; data: Omit<User, 'password'>; message: any; }
   */
  async signin(signInDto: SignInDto, lang: string): Promise<ResponseDto> {
    Logger.log('user-->user.service.ts-->signin');
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
        message: this.i18n.t('user.SignInSuccessful', { lang: lang }),
      };
    } catch (err) {
      this.handleErrorClass.handleError(err);
    }
  }

  /**
   * @function signout
   * @description Signs out a user
   * @author Shaili S.
   * @module user
   * @param userId
   * @returns { statusCode: HttpStatus; data: Omit<User, 'password'>; message: any; }
   */
  async signout(userId: string): Promise<ResponseDto> {
    Logger.log('user-->user.service.ts-->signout');
    try {
      // clear authToken of user
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
      this.handleErrorClass.handleError(err);
    }
  }

  /**
   * @function generateHash
   * @description Generates a hash for password
   * @author Shaili S.
   * @module user
   * @param password
   * @returns passwordHash: string
   */
  async generateHash(password: string): Promise<string> {
    const saltRounds = 10;
    const passwordHash: string = await bcrypt.hash(password, saltRounds);
    return passwordHash;
  }

  /**
   * @function generateToken
   * @description Generates JWT token
   * @author Shaili S.
   * @module user
   * @param id
   * @param email
   * @returns authToken: string
   */
  async generateToken(id: string, email: string): Promise<string> {
    const payload = { sub: id, email: email };
    const authToken: string = await this.jwt.signAsync(payload);
    return authToken;
  }

  /**
   * @function exclude
   * @description Exclude keys of user before sending response
   * @author Shaili S.
   * @param user
   * @param keys
   * @returns Omit<User, Key>
   */
  exclude<User, Key extends keyof User>(
    user: User,
    ...keys: Key[]
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }
}
