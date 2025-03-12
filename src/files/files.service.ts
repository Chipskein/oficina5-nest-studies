import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}
  async create(file: Express.Multer.File,user: { id: number; email: string }) {
    const { mimetype,size,filename,path } = file;
    const userExists=await this.userService.findOne(user.id);
    if(!userExists) throw new BadRequestException('User not found');
    const newFile = this.filesRepository.create({
      user:userExists,
      mimetype,
      size,
      url:path,
      name:filename,
      extension:filename.split('.').pop(),
      
    });
    return await this.filesRepository.save(newFile);
  }

  async findAll(user: { id: number; email: string }) {
    const userExists=await this.userService.findOne(user.id);
    if(!userExists) throw new BadRequestException('User not found');
    return await this.filesRepository.find({where:{user:userExists}});
  }

  async findOne(id: number,user: { id: number; email: string }) {
    const userExists=await this.userService.findOne(user.id);
    if(!userExists) throw new BadRequestException('User not found');
    return await this.filesRepository.findOne({where:{id,user:userExists}});
  }

  async remove(id: number,user: { id: number; email: string }) {
    const userExists=await this.userService.findOne(user.id);
    if(!userExists) throw new BadRequestException('User not found');
    const fileExists=await this.filesRepository.findOne({where:{id,user:userExists}});
    if(!fileExists) throw new BadRequestException('File not found');
    return await this.filesRepository.remove(fileExists);
  }
}
