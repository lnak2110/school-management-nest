import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomError } from '../exceptions/custom-error';
import { ErrorCodes } from '../exceptions/error-codes.enum';
import { handleError } from '../utils/handle-error.util';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getClass());
    const handlerRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles && !handlerRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      handleError(
        new CustomError(
          ErrorCodes.UNAUTHORIZED,
          'Invalid or missing Bearer Token',
        ),
      );
    }

    const token = authHeader.split(' ')[1];
    if (token === 'admin') {
      return true;
    }

    const requiredRoles = [...(roles || []), ...(handlerRoles || [])];
    if (!requiredRoles.includes(token)) {
      handleError(new CustomError(ErrorCodes.FORBIDDEN, 'Forbidden resources'));
    }

    return true;
  }
}
