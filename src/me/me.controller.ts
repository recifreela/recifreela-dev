import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('me')
export class MeController {
  @Get()
  @HttpCode(401)
  getMe() {
    return { error: 'UNAUTHENTICATED' };
  }
}
