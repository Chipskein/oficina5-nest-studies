import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw a NotFoundException if the user is not found', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(null);
      await expect(authService.login('wrong@example.com', 'password')).rejects.toThrow(NotFoundException);
    });

    it('should throw an UnauthorizedException if the password is incorrect', async () => {
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      await expect(authService.login('test@example.com', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should return a token if the credentials are correct', async () => {
        jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      const result = await authService.login('test@example.com', 'password');
      expect(result).toEqual({
        token: 'jwt_token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});
