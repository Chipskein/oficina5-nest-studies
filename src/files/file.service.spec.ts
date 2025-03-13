import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { rm } from 'fs/promises';
import { Readable } from 'stream';

const mockUserRepository = {
  findOne: jest.fn()
};

const mockFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn()
};

jest.mock("fs/promises", () => ({
    rm: jest.fn(),
}));

describe('FileService', () => {
  let service: FilesService;
  let userservice: UsersService;
  let repository: Repository<File>;
  let userrepository: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        FilesService,
        {
          provide: getRepositoryToken(File),
          useValue: mockFileRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = module.get<FilesService>(FilesService);
    repository = module.get<Repository<File>>(getRepositoryToken(File));
    userservice = module.get<UsersService>(UsersService);
    userrepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a file successfully', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
      mockUserRepository.findOne.mockResolvedValue(user);
      mockFileRepository.create.mockResolvedValue(file);
      mockFileRepository.save.mockResolvedValue(file);
      const result=await service.create({
        ...file,
        fieldname: 'string',
        originalname: 'string',
        encoding: 'string',
        stream: new Readable(),
        destination: 'string',
        filename: file.name,
        path: file.url,
        buffer: new Buffer(0)
      },user);
      expect(result).toEqual(file);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(mockFileRepository.create).toHaveBeenCalledWith({name: file.name,size: file.size,url: file.url,extension: file.extension,mimetype: file.mimetype,user: user});
    });

    it('should throw an error if user not found', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.create({
        ...file,
        fieldname: 'string',
        originalname: 'string',
        encoding: 'string',
        stream: new Readable(),
        destination: 'string',
        filename: file.name,
        path: file.url,
        buffer: new Buffer(0)
      },user)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    })
  });

  describe('findAll', () => {
    it('should return an array of files from user', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
      mockUserRepository.findOne.mockResolvedValue(user);
      mockFileRepository.find.mockResolvedValue([file,file,file]);
      const files = await service.findAll(user);
      expect(files).toEqual([file,file,file]);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(mockFileRepository.find).toHaveBeenCalledWith({ where: { user: user } });
    });

    it('should return an error if user not found', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockFileRepository.findOne.mockResolvedValue([]);
      await expect(service.findAll(user)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    });
  });

  describe('remove', () => {
    it('should remove  file from user by id', async () => {
        const user = { id: 1, email: 'test@example.com', password: '' };
        const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
        mockUserRepository.findOne.mockResolvedValue(user);
        mockFileRepository.findOne.mockResolvedValue(file);
        const result = await service.remove(file.id,user);
        expect(result).toEqual(file);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
        expect(mockFileRepository.findOne).toHaveBeenCalledWith({ where: { id:file.id,user: user } });
        expect(rm).toHaveBeenCalledWith(file.url);
    });

    it('should throw an error if user not found', async () => {
        const user = { id: 1, email: 'test@example.com', password: '' };
        const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
        mockUserRepository.findOne.mockResolvedValue(null);
        await expect(service.remove(file.id,user)).rejects.toThrow(BadRequestException);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    });

    it('should throw an error if file not found', async () => {
        const user = { id: 1, email: 'test@example.com', password: '' };
        const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
        mockUserRepository.findOne.mockResolvedValue(user);
        mockFileRepository.findOne.mockResolvedValue(null);
        await expect(service.remove(file.id,user)).rejects.toThrow(BadRequestException);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
        expect(mockFileRepository.findOne).toHaveBeenCalledWith({ where: { id:file.id,user: user } });
    });
  });

  describe('findOne', () => {
    it('should return a file by id from user', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
      mockUserRepository.findOne.mockResolvedValue(user);
      mockFileRepository.findOne.mockResolvedValue(file);
      const result = await service.findOne(file.id,{id:user.id,email:user.email});
      expect(result).toEqual(file);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(mockFileRepository.findOne).toHaveBeenCalledWith({ where: { id: file.id,user:user } });
    });

    it('should throw an error if user not found', async () => {
      const user = { id: 1, email: 'test@example.com', password: '' };
      const file={id: 1,name: 'teste',size: 20000,url: '/path/example',extension: 'png',mimetype: 'image/png',user};
      mockUserRepository.findOne.mockResolvedValue(null);
      mockFileRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(file.id,{id:user.id,email:user.email})).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
    });

  });
});
