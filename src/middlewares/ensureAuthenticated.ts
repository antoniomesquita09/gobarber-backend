import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

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

  if (!authHeader) throw new Error('JWT token is missing.');

  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;

  try {
    const { sub: userId } = verify(token, secret) as TokenPyload;

    request.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token.');
  }
}
