import { Global, Module } from '@nestjs/common';
import { AuthLibService } from './auth-lib.service';
import { jwtHelperService } from './jwt-helper/jwt-helper.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [jwtHelperService],
  exports: [jwtHelperService],
})
export class AuthLibModule {}
