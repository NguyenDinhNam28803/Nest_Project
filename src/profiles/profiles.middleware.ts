import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ProfilesMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('ProfilesMiddleware');
    next();
  }
}
