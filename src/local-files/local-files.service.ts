import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalFile } from './entities/local-file.entity';

@Injectable()
export class LocalFilesService {
    constructor(
        @InjectRepository(LocalFile)
        private readonly localFileRepository: Repository<LocalFile>
    ) {}

    async createMany(files: Express.Multer.File[]) {
        const localFiles = await this.localFileRepository.save(
            files.map(file => ({
                path: file.path,
            }))
        );
        return [localFiles, null];
    }

    async findOne(id: string) {
        const localFile = await this.localFileRepository.findOne({
            where: { id: id }
        });
        return [localFile, null];
    }
}
