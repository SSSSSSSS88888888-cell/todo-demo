import { InputType, Field, Int } from '@nestjs/graphql';
import { Priority } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsPositive,
  Min,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class TemplateItemInput {
  @Field()
  @IsNotEmpty({ message: 'タイトルを入力してください' })
  @MaxLength(200, { message: 'タイトルは200文字以内で入力してください' })
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000, { message: '説明は2000文字以内で入力してください' })
  description?: string;

  @Field()
  @IsNotEmpty({ message: '教科名を入力してください' })
  subjectName: string;

  @Field({ nullable: true })
  @IsOptional()
  unitName?: string;

  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  priority: Priority;

  @Field(() => Int)
  @Min(0, { message: '日数オフセットは0以上で指定してください' })
  dayOffset: number;

  @Field(() => Int, { defaultValue: 1 })
  @IsPositive({ message: '期間は1日以上で指定してください' })
  durationDays: number;
}

@InputType()
export class CreateTemplateInput {
  @Field()
  @IsNotEmpty({ message: 'テンプレート名を入力してください' })
  @MaxLength(100, { message: 'テンプレート名は100文字以内で入力してください' })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000, { message: '説明は2000文字以内で入力してください' })
  description?: string;

  @Field(() => [TemplateItemInput])
  @ArrayMinSize(1, { message: 'テンプレートには1つ以上のアイテムが必要です' })
  @ValidateNested({ each: true })
  @Type(() => TemplateItemInput)
  items: TemplateItemInput[];
}

@InputType()
export class ApplyTemplateInput {
  @Field()
  @IsUUID('4', { message: '有効なテンプレートIDを指定してください' })
  templateId: string;

  @Field()
  @IsDateString({}, { message: '有効な開始日を入力してください' })
  startDate: Date;
}
