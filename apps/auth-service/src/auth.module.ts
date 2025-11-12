import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLibModule } from '@app/auth-lib/auth-lib.module';

@Module({
  imports: [ AuthLibModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
