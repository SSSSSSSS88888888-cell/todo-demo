import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password: '',
    name: 'テスト太郎',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('パスワードをハッシュ化してユーザーを作成する', async () => {
      usersService.create!.mockResolvedValue(mockUser);

      const result = await authService.signup('test@example.com', 'password123', 'テスト太郎');

      // bcrypt.hash が呼ばれた結果がcreateに渡される
      const calledPassword = usersService.create!.mock.calls[0][1];
      expect(calledPassword).not.toBe('password123');
      expect(await bcrypt.compare('password123', calledPassword)).toBe(true);
    });

    it('JWTトークンとユーザー情報を返す', async () => {
      usersService.create!.mockResolvedValue(mockUser);

      const result = await authService.signup('test@example.com', 'password123', 'テスト太郎');

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user-1', email: 'test@example.com' });
    });
  });

  describe('login', () => {
    it('正しい認証情報でトークンを返す', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      usersService.findByEmail!.mockResolvedValue({ ...mockUser, password: hashed });

      const result = await authService.login('test@example.com', 'password123');

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('存在しないメールアドレスで例外を投げる', async () => {
      usersService.findByEmail!.mockResolvedValue(null);

      await expect(authService.login('nobody@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('パスワードが間違っている場合に例外を投げる', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      usersService.findByEmail!.mockResolvedValue({ ...mockUser, password: hashed });

      await expect(authService.login('test@example.com', 'wrong-password'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
