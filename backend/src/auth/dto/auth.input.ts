import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @Field()
  @MinLength(8, { message: 'パスワードは8文字以上で入力してください' })
  password: string;

  @Field()
  @IsNotEmpty({ message: '名前を入力してください' })
  name: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'パスワードを入力してください' })
  password: string;
}
