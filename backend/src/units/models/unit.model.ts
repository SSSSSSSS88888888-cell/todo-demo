import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class UnitModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Int)
  order: number;

  @Field()
  subjectId: string;
}
