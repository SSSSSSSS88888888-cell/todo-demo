import { InputType, Field } from '@nestjs/graphql';
import { Priority, TaskStatus } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsUUID, IsDateString, MaxLength } from 'class-validator';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty({ message: 'タイトルを入力してください' })
  @MaxLength(200, { message: 'タイトルは200文字以内で入力してください' })
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000, { message: '説明は2000文字以内で入力してください' })
  description?: string;

  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  priority: Priority;

  @Field()
  @IsDateString({}, { message: '有効な日付を入力してください' })
  startDate: Date;

  @Field()
  @IsDateString({}, { message: '有効な日付を入力してください' })
  dueDate: Date;

  @Field()
  @IsUUID('4', { message: '有効な教科IDを指定してください' })
  subjectId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: '有効な単元IDを指定してください' })
  unitId?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty({ message: 'タイトルを入力してください' })
  @MaxLength(200, { message: 'タイトルは200文字以内で入力してください' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000, { message: '説明は2000文字以内で入力してください' })
  description?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  priority?: Priority;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  status?: TaskStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: '有効な日付を入力してください' })
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: '有効な日付を入力してください' })
  dueDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: '有効な教科IDを指定してください' })
  subjectId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: '有効な単元IDを指定してください' })
  unitId?: string;
}

@InputType()
export class TaskFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: '有効な教科IDを指定してください' })
  subjectId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: '有効な単元IDを指定してください' })
  unitId?: string;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  priority?: Priority;

  @Field(() => TaskStatus, { nullable: true })
  @IsOptional()
  status?: TaskStatus;
}
