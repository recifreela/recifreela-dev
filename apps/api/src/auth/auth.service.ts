import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Credenciais inválidas',
      );
    }

    const passwordMatch = await bcrypt.compare(
      dto.password_text,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Credenciais inválidas',
      );
    }

    const access_token =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

    return {
      access_token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}