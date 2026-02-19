import { InputType, Field, Int } from '@nestjs/graphql';
import { Priority } from '@prisma/client';

@InputType()
export class TemplateItemInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  subjectName: string;

  @Field({ nullable: true })
  unitName?: string;

  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  priority: Priority;

  @Field(() => Int)
  dayOffset: number;

  @Field(() => Int, { defaultValue: 1 })
  durationDays: number;
}

@InputType()
export class CreateTemplateInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [TemplateItemInput])
  items: TemplateItemInput[];
}

@InputType()
export class ApplyTemplateInput {
  @Field()
  templateId: string;

  @Field()
  startDate: Date;
}
