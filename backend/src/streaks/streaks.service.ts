import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    let streak = await this.prisma.streak.findUnique({ where: { userId } });
    if (!streak) {
      streak = await this.prisma.streak.create({
        data: { userId, currentStreak: 0, longestStreak: 0 },
      });
    }
    return streak;
  }
}
