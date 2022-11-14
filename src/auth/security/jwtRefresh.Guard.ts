import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info: Error) {
    if (err || info || !user) {
      throw err || info || new UnauthorizedException();
    }

    return user;
  }
}
