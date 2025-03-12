import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const MB_BYTES=1048576;
    const MAX_SIZE= 50*MB_BYTES;//50MB
    const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
    const {mimetype, size} = value;
    if (size > MAX_SIZE) throw new BadRequestException("File is too big");
    if (!ALLOWED_MIME_TYPES.includes(mimetype)) throw new BadRequestException("Invalid file type");
    return value;
  }
}
