import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, HttpException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import ResponseObject from './response-object';

@Injectable()
export class ThemValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new HttpException(new ResponseObject(HttpStatus.BAD_REQUEST, 'Validation failed', null, errors.map(e => {
        return {
          at: e.property,
          message: Object.values(e.constraints).join(', ')
        };
      })), HttpStatus.OK);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}