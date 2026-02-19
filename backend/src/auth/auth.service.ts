import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashedPassword, name);
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません');
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user };
  }
}
