import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: { id: string }) {
    return this.usersService.findById(user.id);
  }
}
