import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
@HttpCode(201)
async register(@Body() body: any) {
  return this.authService.register(body);
}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @HttpCode(501)
  forgotPassword(@Body() body: unknown) {
    return {
      error: 'NOT_IMPLEMENTED',
      endpoint: 'POST /auth/forgot-password',
      body,
    };
  }

  @Post('reset-password')
  @HttpCode(501)
  resetPassword(@Body() body: unknown) {
    return {
      error: 'NOT_IMPLEMENTED',
      endpoint: 'POST /auth/reset-password',
      body,
    };
  }
}