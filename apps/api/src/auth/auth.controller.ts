import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dto/register-request.dto';

import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201) 
  async register(@Body() body: RegisterRequestDto) {
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException({
        code: 'PASSWORDS_DONT_MATCH',
        message: 'As senhas digitadas não são iguais',
        fields: { passwordConfirm: 'A confirmação deve ser igual à senha' },
      });
    }

    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }

  @Post('forgot-password')
  @HttpCode(200)
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return { message: 'Se o e-mail existir, um link de recuperação será enviado.' };
  }

  @Post('reset-password')
  @HttpCode(200)
  resetPassword(@Body() body: ResetPasswordDto) {
    return { message: 'Senha alterada com sucesso.' };
  }

  @Post('logout')
  @HttpCode(204) 
  logout() {
    return;
  }
}