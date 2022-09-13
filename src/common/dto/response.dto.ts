import { HttpStatus } from '@nestjs/common';

export class ResponseDto {
  statusCode: HttpStatus;
  data: any;
  message: string | Error;
}
