import { Controller, Get, Post, Param, Delete, UseGuards,Request,Req ,UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatorPipe } from './file-validator/file-validator.pipe';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { File } from './entities/file.entity';

@ApiBearerAuth()
@ApiTags('files')
@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiCreatedResponse({
    description: 'Create file',
    type:File
  })
  @Post()
  @UseInterceptors(FileInterceptor('file',{dest: './tmp'}))
  async upload(@UploadedFile(
    new FileValidatorPipe()
  ) file: Express.Multer.File,@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.create(file,user);
  }

  @ApiOkResponse({
    description: 'Get files from user',
    type:[File]
  })
  @Get()
  async findAll(@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.findAll(user);
  }

  @ApiOkResponse({
    description: 'Get file from user',
    type:File
  })
  @Get(':id')
  async findOne(@Param('id') id: string,@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.findOne(+id,user);
  }

  @ApiOkResponse({
    description: 'File deleted',
    type:File
  })
  @Delete(':id')
  async remove(@Param('id') id: string,@Req() request: Request) {
    const user: {id:number,email:string} | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.remove(+id,user);
  }
}
