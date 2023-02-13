import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ResponseObject from '../etc/response-object';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('create-one')
  async createOne(@Body() info: CreateUserDto) {
    const [user, err] = await this.usersService.createOne(info);
    if (err) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Create account failed', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Create account successfully', user, null);
  }
}
