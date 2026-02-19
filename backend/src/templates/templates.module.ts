import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesResolver } from './templates.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TemplatesService, TemplatesResolver, PrismaService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
