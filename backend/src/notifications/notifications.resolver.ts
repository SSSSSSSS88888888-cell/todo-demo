import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TaskModel } from '../tasks/models/task.model';
import { PrismaService } from '../prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TaskStatus } from '@prisma/client';

@Resolver()
export class NotificationsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [TaskModel])
  @UseGuards(GqlAuthGuard)
  async upcomingDeadlines(
    @CurrentUser() user: { id: string },
    @Args('withinHours', { defaultValue: 24 }) withinHours: number,
  ) {
    const now = new Date();
    const deadline = new Date(now.getTime() + withinHours * 60 * 60 * 1000);

    return this.prisma.task.findMany({
      where: {
        userId: user.id,
        status: { not: TaskStatus.DONE },
        dueDate: { gte: now, lte: deadline },
      },
      include: { subject: true, unit: true },
      orderBy: { dueDate: 'asc' },
    });
  }
}
