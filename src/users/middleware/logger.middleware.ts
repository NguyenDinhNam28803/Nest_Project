import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${req.url}`);
    next();
  }
}
