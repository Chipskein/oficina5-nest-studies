import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {hash} from 'bcrypt';
const saltOrRounds = 10;



@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hash(createUserDto.password, saltOrRounds);
    return await this.usersRepository.save(createUserDto);
  }

  async findAll() {
    return await this.usersRepository.findAndCount();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({where: {id}});
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({where: {email}});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const exists=await this.usersRepository.findOne({where: {id}})
    if(exists!=null){
      return await this.usersRepository.update(id, updateUserDto);
    }
    return "user not found";
  }

  async remove(id: number) {
    const exists=await this.usersRepository.findOne({where: {id}})
    if(exists!=null){
      return await this.usersRepository.delete(id);
    }
    return "user not found";
  }
}