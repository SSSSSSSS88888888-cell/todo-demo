import { Module } from '@nestjs/common';
import { NotificationsResolver } from './notifications.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [NotificationsResolver, PrismaService],
})
export class NotificationsModule {}
