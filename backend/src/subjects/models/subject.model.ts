import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SubjectModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  color: string;

  @Field(() => Int)
  order: number;
}
