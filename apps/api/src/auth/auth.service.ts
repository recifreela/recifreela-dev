import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    ) {}

  async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new UnauthorizedException("Credenciais inválidas");
  }

  const passwordMatch = await bcrypt.compare(
    dto.password,
    user.password,
  );

  if (!passwordMatch) {
    throw new UnauthorizedException("Credenciais inválidas");
  }

  const token = this.jwtService.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    token,
  };
}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        name: dto.nome,
        cpf: dto.cpf,
        cnpj: dto.cnpj,
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}