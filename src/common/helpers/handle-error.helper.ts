import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class HandleErrorClass {
  /**
   * @function handleError
   * @description Handles error of catch block
   * @author Shaili S.
   * @param err
   */
  async handleError(err: { status: any; message: any }): Promise<void> {
    throw new HttpException(err.message, err.status);
  }
}
