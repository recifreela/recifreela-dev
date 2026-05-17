import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dto/register-request.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { AuthResponseDto } from './dto/auth-response.dto';


@Controller('auth')
export class AuthController {
  @Post('register')
  @HttpCode(201) 
  register(@Body() body: RegisterRequestDto) {
    
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException({
        code: 'PASSWORDS_DONT_MATCH',
        message: 'As senhas digitadas não são iguais',
        fields: { passwordConfirm: 'A confirmação deve ser igual à senha' },
      });
    }

    
    return {
      message: 'Dados validados com sucesso. Contrato alinhado com o Banco.',
      user: { email: body.email, role: body.role },
    };
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() body: LoginRequestDto): any {
    
    return { error: 'NOT_IMPLEMENTED', message: 'Aguardando implementação do Service' };
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