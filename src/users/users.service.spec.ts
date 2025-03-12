import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';

// Mocking the repository
const mockUserRepository = {
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = { firstName:"teste",lastName:"teste2",email: 'test@example.com', password: 'password123' };
      const savedUser = { ...createUserDto, id: 1, password: '' };
      mockUserRepository.save.mockResolvedValue(savedUser);
      const result = await service.create(createUserDto);
      expect(result).toEqual(savedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });

  });

  describe('findAll', () => {
    it('should return an array of users and their count', async () => {
      const result = [[{ id: 1, email: 'test@example.com', password: '' }], 1];
      mockUserRepository.findAndCount.mockResolvedValue(result);
      const users = await service.findAll();
      expect(users).toEqual(result);
      expect(mockUserRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await service.findOne(1);
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if no user found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await service.findOne(999);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'nodmemafjaskf' };
      const existingUser = { firstName:"douglas" ,id: 1, email: 'test@example.com', password: '' };
      const updatedUser = { ...existingUser, ...updateUserDto };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.update(999, { firstName: 'seilameu' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      mockUserRepository.findOne.mockResolvedValue(user);
      mockUserRepository.findOne.mockResolvedValue(user);
      const result = await service.remove(1);
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(BadRequestException);
    });
  });
});
