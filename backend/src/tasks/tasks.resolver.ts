import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TaskModel } from './models/task.model';
import { TasksService } from './tasks.service';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from './dto/task.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => TaskModel)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query(() => [TaskModel])
  @UseGuards(GqlAuthGuard)
  async tasks(
    @CurrentUser() user: { id: string },
    @Args('filter', { nullable: true }) filter?: TaskFilterInput,
  ) {
    return this.tasksService.findAll(user.id, filter);
  }

  @Query(() => TaskModel)
  @UseGuards(GqlAuthGuard)
  async task(@CurrentUser() user: { id: string }, @Args('id') id: string) {
    return this.tasksService.findById(id, user.id);
  }

  @Query(() => [TaskModel])
  @UseGuards(GqlAuthGuard)
  async todayTasks(@CurrentUser() user: { id: string }) {
    return this.tasksService.todayTasks(user.id);
  }

  @Mutation(() => TaskModel)
  @UseGuards(GqlAuthGuard)
  async createTask(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateTaskInput,
  ) {
    return this.tasksService.create(user.id, input);
  }

  @Mutation(() => TaskModel)
  @UseGuards(GqlAuthGuard)
  async updateTask(
    @CurrentUser() user: { id: string },
    @Args('id') id: string,
    @Args('input') input: UpdateTaskInput,
  ) {
    return this.tasksService.update(id, user.id, input);
  }

  @Mutation(() => TaskModel)
  @UseGuards(GqlAuthGuard)
  async deleteTask(@CurrentUser() user: { id: string }, @Args('id') id: string) {
    return this.tasksService.delete(id, user.id);
  }
}
