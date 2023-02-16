import { Controller, Get, HttpStatus, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import ResponseObject from '../etc/response-object';
import { LocalFilesService } from './local-files.service';
import { UploadFilePipe } from './upload-file.pipe';
import { Response } from 'express';
import { resolve } from 'path';

@Controller('local-files')
@ApiTags('local-files')
export class LocalFilesController {
  constructor(private readonly localFilesService: LocalFilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          }
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles(new UploadFilePipe({
    destination: 'uploads'
  })) files: Express.Multer.File[]) {
    const [localFiles, err] = await this.localFilesService.createMany(files);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Upload files failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Upload files successfully', localFiles, null);
  }

  @Get('get-file/:id')
  @ApiParam({ name: 'id', description: 'File id' })
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const [localFile, err] = await this.localFilesService.findOne(id);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get file failed', null, err);
    }
    return res.sendFile(resolve(__dirname + '/../../' + localFile.path));
  }
}
