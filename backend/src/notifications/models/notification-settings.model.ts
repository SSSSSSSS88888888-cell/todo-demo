import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class NotificationSettingsModel {
  @Field()
  enabled: boolean;

  @Field(() => Int)
  reminderMinutesBefore: number;
}
