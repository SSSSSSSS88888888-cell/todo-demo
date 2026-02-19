import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StreakModel } from './models/streak.model';
import { StreaksService } from './streaks.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => StreakModel)
export class StreaksResolver {
  constructor(private streaksService: StreaksService) {}

  @Query(() => StreakModel)
  @UseGuards(GqlAuthGuard)
  async myStreak(@CurrentUser() user: { id: string }) {
    return this.streaksService.findByUser(user.id);
  }
}
