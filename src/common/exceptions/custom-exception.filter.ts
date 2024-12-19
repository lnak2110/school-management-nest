import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from './custom-exception';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: CustomException =
      exception.getResponse() as CustomException;
    const { errorCode, devMessage, data } = exceptionResponse;

    response.status(status).json({
      errorCode: errorCode || 'UNKNOWN_ERROR',
      devMessage: devMessage || 'An error occurred',
      data: data || {},
    });
  }
}
