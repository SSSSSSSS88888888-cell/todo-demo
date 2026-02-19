import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Priority, TaskStatus } from '@prisma/client';
import { SubjectModel } from '../../subjects/models/subject.model';
import { UnitModel } from '../../units/models/unit.model';

registerEnumType(Priority, { name: 'Priority' });
registerEnumType(TaskStatus, { name: 'TaskStatus' });

@ObjectType()
export class TaskModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Priority)
  priority: Priority;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field()
  startDate: Date;

  @Field()
  dueDate: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field()
  userId: string;

  @Field()
  subjectId: string;

  @Field({ nullable: true })
  unitId?: string;

  @Field(() => SubjectModel)
  subject: SubjectModel;

  @Field(() => UnitModel, { nullable: true })
  unit?: UnitModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
