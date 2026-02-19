import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class StreakModel {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => Int)
  currentStreak: number;

  @Field(() => Int)
  longestStreak: number;

  @Field({ nullable: true })
  lastCompletionDate?: Date;

  @Field()
  updatedAt: Date;
}
