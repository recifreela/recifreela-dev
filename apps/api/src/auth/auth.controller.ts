import { Body, Controller, HttpCode, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(501)
  register(@Body() body: unknown) {
    return { error: 'NOT_IMPLEMENTED', endpoint: 'POST /auth/register', body };
  }

  @Post('login')
  @HttpCode(501)
  login(@Body() body: unknown) {
    return { error: 'NOT_IMPLEMENTED', endpoint: 'POST /auth/login', body };
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
