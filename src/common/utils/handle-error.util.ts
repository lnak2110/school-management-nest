import { CustomException } from '../exceptions/custom-exception';
import { CustomError } from '../exceptions/custom-error';

export function handleError(error: any): never {
  if (error instanceof CustomError) {
    throw new CustomException(
      error.statusCode,
      error.errorCode,
      error.devMessage,
      error.data,
    );
  }
  throw new CustomException();
}
