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

    const email =
      dto.email.toLowerCase();

    const user =
      await this.prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        dto.password,
        user.passwordHash,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      access_token: token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

async register(dto: any) {
  const userExists = await this.prisma.user.findUnique({
    where: {
      email: dto.email.toLowerCase(),
    },
  });

  if (userExists) {
    throw new UnauthorizedException('Email já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      role: dto.role,
      email: dto.email.toLowerCase(),
      passwordHash: hashedPassword,
    },
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
}