import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { TaskStatus, Priority } from '@prisma/client';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: {
    task: Record<string, jest.Mock>;
    streak: Record<string, jest.Mock>;
  };

  const userId = 'user-1';
  const mockTask = {
    id: 'task-1',
    title: '算数ドリル',
    description: null,
    priority: Priority.MEDIUM,
    status: TaskStatus.TODO,
    startDate: new Date('2026-02-20'),
    dueDate: new Date('2026-02-28'),
    completedAt: null,
    userId,
    subjectId: 'subject-1',
    unitId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    subject: { id: 'subject-1', name: '算数', color: '#3B82F6', order: 1 },
    unit: null,
  };

  beforeEach(async () => {
    prisma = {
      task: {
        findMany: jest.fn().mockResolvedValue([mockTask]),
        findFirst: jest.fn().mockResolvedValue(mockTask),
        create: jest.fn().mockResolvedValue(mockTask),
        update: jest.fn().mockResolvedValue(mockTask),
        delete: jest.fn().mockResolvedValue(mockTask),
      },
      streak: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('ユーザーのタスク一覧を返す', async () => {
      const result = await service.findAll(userId);

      expect(result).toEqual([mockTask]);
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
          include: { subject: true, unit: true },
        }),
      );
    });

    it('フィルタ条件を適用する', async () => {
      await service.findAll(userId, { subjectId: 'subject-1', status: TaskStatus.TODO });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, subjectId: 'subject-1', status: TaskStatus.TODO },
        }),
      );
    });
  });

  describe('findById', () => {
    it('タスクが存在する場合に返す', async () => {
      const result = await service.findById('task-1', userId);
      expect(result).toEqual(mockTask);
    });

    it('タスクが存在しない場合にNotFoundExceptionを投げる', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.findById('nonexistent', userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('タスクを作成してuserIdを付与する', async () => {
      const input = {
        title: '国語読解',
        startDate: new Date('2026-03-01'),
        dueDate: new Date('2026-03-10'),
        subjectId: 'subject-2',
        priority: Priority.HIGH,
      };

      await service.create(userId, input);

      expect(prisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { ...input, userId },
        }),
      );
    });
  });

  describe('update', () => {
    it('ステータスをDONEに変更するとcompletedAtが設定される', async () => {
      prisma.task.findFirst.mockResolvedValue({ ...mockTask, status: TaskStatus.IN_PROGRESS });

      await service.update('task-1', userId, { status: TaskStatus.DONE });

      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: TaskStatus.DONE,
            completedAt: expect.any(Date),
          }),
        }),
      );
    });

    it('DONEから別ステータスに戻すとcompletedAtがnullになる', async () => {
      prisma.task.findFirst.mockResolvedValue({ ...mockTask, status: TaskStatus.DONE, completedAt: new Date() });

      await service.update('task-1', userId, { status: TaskStatus.TODO });

      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: TaskStatus.TODO,
            completedAt: null,
          }),
        }),
      );
    });

    it('存在しないタスクを更新しようとするとNotFoundExceptionを投げる', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.update('nonexistent', userId, { title: 'test' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('タスクを削除する', async () => {
      await service.delete('task-1', userId);

      expect(prisma.task.delete).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'task-1' } }),
      );
    });

    it('他ユーザーのタスクは削除できない（見つからない）', async () => {
      prisma.task.findFirst.mockResolvedValue(null);

      await expect(service.delete('task-1', 'other-user'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('todayTasks', () => {
    it('今日の期間内にあるタスクを返す', async () => {
      await service.todayTasks(userId);

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            status: { not: TaskStatus.DONE },
          }),
        }),
      );
    });
  });
});
