import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Priority } from '@prisma/client';

@ObjectType()
export class TemplateItemModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  subjectName: string;

  @Field({ nullable: true })
  unitName?: string;

  @Field(() => Priority)
  priority: Priority;

  @Field(() => Int)
  dayOffset: number;

  @Field(() => Int)
  durationDays: number;
}

@ObjectType()
export class TemplateModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  userId: string;

  @Field(() => [TemplateItemModel])
  items: TemplateItemModel[];

  @Field()
  createdAt: Date;
}
