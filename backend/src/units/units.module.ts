import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsResolver } from './units.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [UnitsService, UnitsResolver, PrismaService],
  exports: [UnitsService],
})
export class UnitsModule {}
