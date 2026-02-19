import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async findBySubject(subjectId: string) {
    return this.prisma.unit.findMany({
      where: { subjectId },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.unit.findUnique({ where: { id } });
  }
}
