import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from './dto/task.input';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, filter?: TaskFilterInput) {
    const where: any = { userId };
    if (filter?.subjectId) where.subjectId = filter.subjectId;
    if (filter?.unitId) where.unitId = filter.unitId;
    if (filter?.priority) where.priority = filter.priority;
    if (filter?.status) where.status = filter.status;

    return this.prisma.task.findMany({
      where,
      include: { subject: true, unit: true },
      orderBy: [{ dueDate: 'asc' }, { priority: 'asc' }],
    });
  }

  async findById(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { subject: true, unit: true },
    });
    if (!task) throw new NotFoundException('タスクが見つかりません');
    return task;
  }

  async create(userId: string, input: CreateTaskInput) {
    return this.prisma.task.create({
      data: { ...input, userId },
      include: { subject: true, unit: true },
    });
  }

  async update(id: string, userId: string, input: UpdateTaskInput) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('タスクが見つかりません');

    const data: any = { ...input };

    // タスクが完了に変更された場合
    if (input.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
      data.completedAt = new Date();
      // ストリーク更新
      await this.updateStreak(userId);
    }
    // 完了から別のステータスに戻された場合
    if (input.status && input.status !== TaskStatus.DONE && task.status === TaskStatus.DONE) {
      data.completedAt = null;
    }

    return this.prisma.task.update({
      where: { id },
      data,
      include: { subject: true, unit: true },
    });
  }

  async delete(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException('タスクが見つかりません');
    return this.prisma.task.delete({
      where: { id },
      include: { subject: true, unit: true },
    });
  }

  async todayTasks(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.task.findMany({
      where: {
        userId,
        status: { not: TaskStatus.DONE },
        startDate: { lte: tomorrow },
        dueDate: { gte: today },
      },
      include: { subject: true, unit: true },
      orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
    });
  }

  private async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streak = await this.prisma.streak.findUnique({ where: { userId } });

    if (!streak) {
      await this.prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastCompletionDate: today,
        },
      });
      return;
    }

    const lastDate = streak.lastCompletionDate
      ? new Date(streak.lastCompletionDate)
      : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    // 同日の場合は更新不要
    if (lastDate && lastDate.getTime() === today.getTime()) return;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak: number;
    if (lastDate && lastDate.getTime() === yesterday.getTime()) {
      newStreak = streak.currentStreak + 1;
    } else {
      newStreak = 1;
    }

    await this.prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastCompletionDate: today,
      },
    });
  }
}
