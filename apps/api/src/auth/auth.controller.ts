import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dto/register-request.dto'
import { LoginRequestDto } from './dto/login-request.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(501)
  register(@Body() body: RegisterRequestDto): any {
    return { error: 'NOT_IMPLEMENTED', endpoint: 'POST /auth/register', body };
  }

  @Post('login')
  @HttpCode(501)
  login(@Body() body: LoginRequestDto): Promise<AuthResponseDto> | any {
    return { error: 'NOT_IMPLEMENTED', endpoint: 'POST /auth/login', body };
  }

  @Post('forgot-password')
  @HttpCode(501)
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return {
      error: 'NOT_IMPLEMENTED',
      endpoint: 'POST /auth/forgot-password',
      body,
    };
  }

  @Post('reset-password')
  @HttpCode(501)
  resetPassword(@Body() body: ResetPasswordDto) {
    return {
      error: 'NOT_IMPLEMENTED',
      endpoint: 'POST /auth/reset-password',
      body,
    };
  }
  @Post('logout')
  @HttpCode(501)
  logout() {
    return { message: 'NOT_IMPLEMENTED' };
  }
}
