import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { MeController } from './me/me.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController, HealthController, MeController],
  providers: [AppService],
})
export class AppModule {}
