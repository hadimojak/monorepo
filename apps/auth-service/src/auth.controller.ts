import {
  Controller,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body.email, body.password);
  }

  @HttpCode(200)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Body() body: RefreshDto) {
    return this.authService.logout(body.refreshToken);
  }

  @HttpCode(200)
  @Post('refresh')
  refersh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @HttpCode(200)
  @Post('forget-password')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body.email);
  }
}
