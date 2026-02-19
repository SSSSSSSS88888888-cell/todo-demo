import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksResolver } from './streaks.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [StreaksService, StreaksResolver, PrismaService],
  exports: [StreaksService],
})
export class StreaksModule {}
