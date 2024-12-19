import { ResponseDto } from '../dto/response.dto';
export function createResponse<T>(
  statusCode: number,
  message: string,
  data: T,
): ResponseDto<T> {
  return { statusCode, message, data };
}
