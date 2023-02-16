import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as fs from 'fs';

export enum UploadFileMimeType {
    IMAGE = 'image/*',
    VIDEO = 'video/*',
    AUDIO = 'audio/*',
    APPLICATION = 'application/*',
    TEXT = 'text/*',
    ALL = '*/*',
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    GIF = 'image/gif',
    WEBP = 'image/webp',
    MP4 = 'video/mp4',
    WEBM = 'video/webm',
    OGG = 'video/ogg',
    MP3 = 'audio/mpeg',
    OGG_AUDIO = 'audio/ogg',
    WAV = 'audio/wav',
    PDF = 'application/pdf',
    JSON = 'application/json',
    XML = 'application/xml',
    HTML = 'text/html',
    TEXT_PLAIN = 'text/plain',
    CSV = 'text/csv',
    TSV = 'text/tab-separated-values',
    CSS = 'text/css',
    JAVASCRIPT = 'text/javascript',
    BINARY = 'application/octet-stream',
    ZIP = 'application/zip',
    GZIP = 'application/gzip',
    RAR = 'application/x-rar-compressed',
    TAR = 'application/x-tar'
}

interface UploadFileOption {
    maxCount?: number;
    maxSize?: number;
    mimeTypes?: UploadFileMimeType[];
    destination?: string;
}

@Injectable()
export class UploadFilePipe implements PipeTransform {
    constructor(private readonly options?: UploadFileOption) {}

    async transform(files: Express.Multer.File[]) {
        if (this.options) {
            if (this.options.maxCount && files.length > this.options.maxCount) {
                throw new BadRequestException(`Max count is ${this.options.maxCount}`);
            }
            if (this.options.maxSize) {
                for (const file of files) {
                    if (file.size > this.options.maxSize) {
                        throw new BadRequestException(`Max size is ${this.options.maxSize}`);
                    }
                }
            }
            if (this.options.mimeTypes) {
                for (const file of files) {
                    if (!this.options.mimeTypes.includes(file.mimetype as UploadFileMimeType)) {
                        throw new BadRequestException(`Mime type is not allowed`);
                    }
                }
            }
            if (this.options.destination) {
                if (!fs.existsSync(this.options.destination)) {
                    fs.mkdirSync(this.options.destination, { recursive: true });
                }
                for (const file of files) {
                    file.destination = this.options.destination ? this.options.destination : file.destination;
                    file.filename = `${randomUUID()}-${file.originalname}`;
                    file.path = `${file.destination}/${file.filename}`;
                    fs.writeFile(file.path, file.buffer, () => {
                        console.log(`File ${file.filename} has been saved`);
                    });
                }
            }
        }
        return files;
    }
}