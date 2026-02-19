import { InputType, Field } from '@nestjs/graphql';
import { Priority, TaskStatus } from '@prisma/client';

@InputType()
export class CreateTaskInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  priority: Priority;

  @Field()
  startDate: Date;

  @Field()
  dueDate: Date;

  @Field()
  subjectId: string;

  @Field({ nullable: true })
  unitId?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Priority, { nullable: true })
  priority?: Priority;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  subjectId?: string;

  @Field({ nullable: true })
  unitId?: string;
}

@InputType()
export class TaskFilterInput {
  @Field({ nullable: true })
  subjectId?: string;

  @Field({ nullable: true })
  unitId?: string;

  @Field(() => Priority, { nullable: true })
  priority?: Priority;

  @Field(() => TaskStatus, { nullable: true })
  status?: TaskStatus;
}
