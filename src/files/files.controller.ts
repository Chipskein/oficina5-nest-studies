import { Controller, Get, Post, Param, Delete, UseGuards,Request,Req ,UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatorPipe } from './file-validator/file-validator.pipe';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file',{dest: './tmp'}))
  async upload(@UploadedFile(
    new FileValidatorPipe()
  ) file: Express.Multer.File,@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.create(file,user);
  }

  @Get()
  async findAll(@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string,@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.findOne(+id,user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string,@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.remove(+id,user);
  }
}
