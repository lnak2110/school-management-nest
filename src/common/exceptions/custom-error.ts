import { HttpStatus } from '@nestjs/common';
import { DataException } from './custom-exception';
import { ErrorCodes } from './error-codes.enum';

const ErrorStatusMap: { [key in ErrorCodes]: number } = {
  [ErrorCodes.BAD_REQUEST_INPUT]: HttpStatus.BAD_REQUEST,
  [ErrorCodes.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ErrorCodes.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ErrorCodes.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCodes.CONFLICT]: HttpStatus.CONFLICT,
  [ErrorCodes.SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export class CustomError extends Error {
  public statusCode: number;

  constructor(
    public errorCode: ErrorCodes = ErrorCodes.SERVER_ERROR,
    public devMessage: string = 'Server error',
    public data: DataException | {} = {},
  ) {
    super(devMessage);
    this.name = this.constructor.name;
    this.statusCode =
      ErrorStatusMap[this.errorCode] || ErrorStatusMap[ErrorCodes.SERVER_ERROR];
  }
}
