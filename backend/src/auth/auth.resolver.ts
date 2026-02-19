import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './models/auth.model';
import { SignupInput, LoginInput } from './dto/auth.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signup(@Args('input') input: SignupInput) {
    return this.authService.signup(input.email, input.password, input.name);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.authService.login(input.email, input.password);
  }
}
