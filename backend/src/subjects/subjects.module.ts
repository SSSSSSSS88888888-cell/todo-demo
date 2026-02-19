import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsResolver } from './subjects.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [SubjectsService, SubjectsResolver, PrismaService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
