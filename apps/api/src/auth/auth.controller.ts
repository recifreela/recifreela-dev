import { Controller, Post, Body } from "@nestjs/common";
import { Res } from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @Post("login")
    async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    ) {
  const result = await this.authService.login(dto);

  res.cookie("access_token", result.token, {
    httpOnly: true,
    secure: false, // true em produção
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  });

    return {
        id: result.id,
        email: result.email,
        role: result.role,
        };
    }

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}