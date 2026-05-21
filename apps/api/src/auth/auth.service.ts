import { Injectable, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { UserRole } from './common/enums/auth.enum';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(dto: RegisterRequestDto) {

    return { id: 'uuid-fake', email: dto.email, role: dto.role };
  }

  async login(dto: LoginDto) {
    
    const payload = { email: dto.email, sub: 'user-id-123' };
    
    return {
      user_id: 'mock-id-123',
      email: dto.email,
      role: UserRole.FREELA, // Use um valor do enum
      access_token: this.jwtService.sign(payload),
    };
  }
}