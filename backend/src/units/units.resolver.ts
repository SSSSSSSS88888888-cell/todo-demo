import { Resolver, Query, Args } from '@nestjs/graphql';
import { UnitModel } from './models/unit.model';
import { UnitsService } from './units.service';

@Resolver(() => UnitModel)
export class UnitsResolver {
  constructor(private unitsService: UnitsService) {}

  @Query(() => [UnitModel])
  async unitsBySubject(@Args('subjectId') subjectId: string) {
    return this.unitsService.findBySubject(subjectId);
  }
}
