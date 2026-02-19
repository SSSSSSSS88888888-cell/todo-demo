import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subject.findMany({
      orderBy: { order: 'asc' },
      include: { units: { orderBy: { order: 'asc' } } },
    });
  }

  async findById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
      include: { units: { orderBy: { order: 'asc' } } },
    });
  }
}
