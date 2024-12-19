import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes } from './error-codes.enum';

export type DataException = {
  field: string;
  value: unknown;
};

export class CustomException extends HttpException {
  constructor(
    status: number = HttpStatus.INTERNAL_SERVER_ERROR,
    public errorCode: ErrorCodes = ErrorCodes.SERVER_ERROR,
    public devMessage: string = 'Server error',
    public data: DataException | {} = {},
  ) {
    super(
      {
        errorCode,
        devMessage,
        data,
      },
      status,
    );
  }
}
