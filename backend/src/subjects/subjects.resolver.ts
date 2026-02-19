import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { SubjectModel } from './models/subject.model';
import { SubjectsService } from './subjects.service';
import { UnitModel } from '../units/models/unit.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => SubjectModel)
export class SubjectsResolver {
  constructor(
    private subjectsService: SubjectsService,
    private prisma: PrismaService,
  ) {}

  @Query(() => [SubjectModel])
  async subjects() {
    return this.subjectsService.findAll();
  }

  @Query(() => SubjectModel, { nullable: true })
  async subject(@Args('id') id: string) {
    return this.subjectsService.findById(id);
  }

  @ResolveField(() => [UnitModel])
  async units(@Parent() subject: SubjectModel) {
    return this.prisma.unit.findMany({
      where: { subjectId: subject.id },
      orderBy: { order: 'asc' },
    });
  }
}
