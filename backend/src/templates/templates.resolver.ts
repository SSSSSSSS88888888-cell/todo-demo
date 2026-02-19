import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TemplateModel } from './models/template.model';
import { TaskModel } from '../tasks/models/task.model';
import { TemplatesService } from './templates.service';
import { CreateTemplateInput, ApplyTemplateInput } from './dto/template.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => TemplateModel)
export class TemplatesResolver {
  constructor(private templatesService: TemplatesService) {}

  @Query(() => [TemplateModel])
  @UseGuards(GqlAuthGuard)
  async templates(@CurrentUser() user: { id: string }) {
    return this.templatesService.findAll(user.id);
  }

  @Query(() => TemplateModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async template(@Args('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Mutation(() => TemplateModel)
  @UseGuards(GqlAuthGuard)
  async createTemplate(
    @CurrentUser() user: { id: string },
    @Args('input') input: CreateTemplateInput,
  ) {
    return this.templatesService.create(user.id, input);
  }

  @Mutation(() => TemplateModel)
  @UseGuards(GqlAuthGuard)
  async deleteTemplate(
    @CurrentUser() user: { id: string },
    @Args('id') id: string,
  ) {
    return this.templatesService.delete(id, user.id);
  }

  @Mutation(() => [TaskModel])
  @UseGuards(GqlAuthGuard)
  async applyTemplate(
    @CurrentUser() user: { id: string },
    @Args('input') input: ApplyTemplateInput,
  ) {
    return this.templatesService.apply(user.id, input);
  }
}
