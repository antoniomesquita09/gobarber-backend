import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface TokenPyload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing.', 401);

  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;

  try {
    const { sub: userId } = verify(token, secret) as TokenPyload;

    request.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token.', 401);
  }
}
