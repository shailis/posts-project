import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // Logger.error(MESSAGES.UNKNOWN_EXCEPTION_MESSAGE);

    Logger.error(
      `${request.method} ${
        request.url
      } at ${new Date().toLocaleDateString()}} Error: ${exception.message}`,
    );

    // exception['response']['message'] property is present for class-validator ValidationPipe BadRequestException
    // whereas we return exception.message for any HttpException thrown by us or otherwise
    response.status(status).json({
      statusCode: status,
      data: {},
      message: exception['response']['message'] ?? exception.message,
    });
  }
}
