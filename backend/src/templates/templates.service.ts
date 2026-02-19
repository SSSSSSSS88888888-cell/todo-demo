import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTemplateInput, ApplyTemplateInput } from './dto/template.input';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.template.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.template.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async create(userId: string, input: CreateTemplateInput) {
    return this.prisma.template.create({
      data: {
        name: input.name,
        description: input.description,
        userId,
        items: {
          create: input.items,
        },
      },
      include: { items: true },
    });
  }

  async delete(id: string, userId: string) {
    const template = await this.prisma.template.findFirst({
      where: { id, userId },
    });
    if (!template) throw new NotFoundException('テンプレートが見つかりません');
    return this.prisma.template.delete({
      where: { id },
      include: { items: true },
    });
  }

  async apply(userId: string, input: ApplyTemplateInput) {
    const template = await this.prisma.template.findUnique({
      where: { id: input.templateId },
      include: { items: true },
    });
    if (!template) throw new NotFoundException('テンプレートが見つかりません');

    const startDate = new Date(input.startDate);
    const tasks = [];

    for (const item of template.items) {
      // 教科名から教科を検索
      const subject = await this.prisma.subject.findUnique({
        where: { name: item.subjectName },
      });
      if (!subject) continue;

      // 単元名から単元を検索
      let unit = null;
      if (item.unitName) {
        unit = await this.prisma.unit.findFirst({
          where: { subjectId: subject.id, name: item.unitName },
        });
      }

      const taskStartDate = new Date(startDate);
      taskStartDate.setDate(taskStartDate.getDate() + item.dayOffset);
      const taskDueDate = new Date(taskStartDate);
      taskDueDate.setDate(taskDueDate.getDate() + item.durationDays - 1);

      const task = await this.prisma.task.create({
        data: {
          title: item.title,
          description: item.description,
          priority: item.priority,
          startDate: taskStartDate,
          dueDate: taskDueDate,
          userId,
          subjectId: subject.id,
          unitId: unit?.id,
        },
        include: { subject: true, unit: true },
      });
      tasks.push(task);
    }

    return tasks;
  }
}
