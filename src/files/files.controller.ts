import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidatorPipe } from './file-validator/file-validator.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { File } from './entities/file.entity';
import { FileUploadDto } from './dto/file-upload-dto';
@ApiBearerAuth()
@ApiTags('files')
@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload file',
    type: FileUploadDto,
  })
  @ApiCreatedResponse({
    description: 'Create file',
    type: File,
  })
  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: './tmp' }))
  async upload(
    @UploadedFile(new FileValidatorPipe()) file: Express.Multer.File,
    @Req() request: Request,
  ) {
    const user: { id: number; email: string } | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.create(file, user);
  }

  @ApiOkResponse({
    description: 'Get files from user',
    type: [File],
  })
  @Get()
  async findAll(@Req() request: Request) {
    const user: { id: number; email: string } | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.findAll(user);
  }

  @ApiOkResponse({
    description: 'Get file from user',
    type: File,
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    const user: { id: number; email: string } | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.findOne(+id, user);
  }

  @ApiOkResponse({
    description: 'File deleted',
    type: File,
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: Request) {
    const user: { id: number; email: string } | undefined = request['user'];
    if (!user) throw new BadRequestException('User not found');
    return await this.filesService.remove(+id, user);
  }
}
